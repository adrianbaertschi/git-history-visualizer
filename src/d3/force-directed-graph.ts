import * as d3 from 'd3'
import { HierarchyNode, HierarchyPointLink, HierarchyPointNode, Simulation } from 'd3'
import { Selection } from 'd3-selection'
import { Tree } from './tree-builder'
import 'css.escape'
import { D3DragEvent } from 'd3-drag'
import { SimulationNodeDatum } from 'd3-force'

export class ForceDirectedGraph {
  simulation: d3.Simulation<d3.HierarchyPointNode<Tree>, d3.HierarchyPointLink<Tree>>
  linkContainer: Selection<SVGGElement, unknown, HTMLElement, any>
  nodeContainer: Selection<SVGGElement, HierarchyPointNode<Tree>, HTMLElement, any>
  nodes: Array<HierarchyPointNode<Tree>>
  links: Array<HierarchyPointLink<Tree>>

  constructor (data: Tree) {
    const margin = {
      top: 20,
      right: 120,
      bottom: 30,
      left: 90
    }
    const width = 660 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    const svg: Selection<SVGSVGElement, any, HTMLElement, any> = d3.select('body').append('svg')
      .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)

    this.linkContainer = svg.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)

    this.nodeContainer = svg.append('g')
      .attr('fill', '#0099ff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)

    const root: HierarchyNode<Tree> = d3.hierarchy(data)
    const tree: HierarchyPointNode<Tree> = d3.tree<Tree>().size([height, width])(root)
    this.links = tree.links()
    this.nodes = tree.descendants()

    this.simulation = d3.forceSimulation<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>(this.nodes)
      .force('link', d3.forceLink<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>(this.links)
        .id(d => d.id ?? 'missing-id')
        .distance(0)
        .strength(1))
      .force('charge', d3.forceManyBody()
        .strength(-50))
      .force('x', d3.forceX())
      .force('y', d3.forceY())

    this.update()
  }

  addNode (filepath: string): void {
    const parentPath = filepath.substr(0, filepath.lastIndexOf('/'))
    const parent = this.nodes.filter(n => n.data.path === parentPath)[0]
    if (parent == null) {
      throw new Error(`Parent not found for ${filepath}: ${parentPath}`)
    }
    const fileName = filepath.split('/').pop() ?? 'not found'
    const data: Tree = {
      name: fileName,
      path: filepath
    }
    const nodeToInsert: HierarchyPointNode<Tree> = Object.assign({}, parent)
    nodeToInsert.data = data

    this.nodes.push(nodeToInsert)
    this.links.push({
      source: parent,
      target: nodeToInsert
    })

    this.update()
  };

  remove (filepath: string): void {
    const nodeIndex = this.nodes.findIndex(n => n.data.path === filepath)
    if (nodeIndex === -1) {
      throw new Error(`Path ${filepath} not found in nodes`)
    }
    this.nodes.splice(nodeIndex, 1)

    const linkIndex = this.links.findIndex(l => l.target.data.path === filepath)
    if (linkIndex === -1) {
      throw new Error(`Path ${filepath} not found in links`)
    }
    this.links.splice(linkIndex, 1)

    this.update()
  }

  modify (path: string): void {
    const cssId = CSS.escape(path)
    const selection = this.nodeContainer.select(`#${cssId}`)

    if (selection.empty()) {
      throw new Error(`Node ${path} not found`)
    }
    selection
      .transition()
      .duration(1000)
      .attr('fill', 'red')
      .attr('stroke', 'red')
      .transition() // transition back to normal
      .delay(1000)
      .duration(1000)
      .attr('fill', d => d.data.name.includes('.') ? '#0099ff' : '#000')
      .attr('stroke', d => d.data.name.includes('.') ? '#0099ff' : '#000')
  }

  update (): void {
    this.simulation.nodes(this.nodes)

    const link = this.linkContainer.selectAll('line')
      .data(this.links, (d: any) => d.target.data.path)
      .join('line')

    const node = this.nodeContainer.selectAll('circle')
      .data<HierarchyPointNode<Tree>>(this.nodes, (d: any) => d.data.path)
      .join('circle')
      .attr('fill', d => d.data.name.includes('.') ? '#0099ff' : '#000') // TODO this condition is not 100% correct
      .attr('stroke', d => d.data.name.includes('.') ? '#0099ff' : '#000')
      .attr('r', 3.5)
      .attr('id', d => d.data.path)
      .call(drag(this.simulation))

    node.append('title')
      .text(d => d.data.path)

    this.simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
    })

    this.simulation.alphaTarget(0.3).restart()
  }
}

const drag = (simulation: Simulation<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>): any => {
  type D3GraphDragEvent = D3DragEvent<SVGCircleElement, Tree, SimulationNodeDatum>
  const dragStarted = (event: D3GraphDragEvent): void => {
    if (event.active > 0) {
      simulation.alphaTarget(0.3).restart()
    }
    event.subject.fx = event.subject.x
    event.subject.fy = event.subject.y
  }

  const dragged = (event: D3GraphDragEvent): void => {
    event.subject.fx = event.x
    event.subject.fy = event.y
  }

  const dragEnded = (event: D3GraphDragEvent): void => {
    if (event.active > 0) {
      simulation.alphaTarget(0)
    }
    event.subject.fx = null
    event.subject.fy = null
  }

  return d3.drag()
    .on('start', dragStarted)
    .on('drag', dragged)
    .on('end', dragEnded)
}
