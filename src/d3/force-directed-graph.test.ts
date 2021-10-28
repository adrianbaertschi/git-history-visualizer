/**
 * @jest-environment jsdom
 */

import { Tree } from './tree-builder'
import { ForceDirectedGraph } from './force-directed-graph'

describe('Operations with simple graph', () => {
  let graph: ForceDirectedGraph
  beforeEach(() => {
    const data: Tree = {
      name: 'root',
      path: 'root',
      children: [{
        name: 'a',
        path: 'root/a',
        children: []
      }]
    }
    graph = new ForceDirectedGraph(data)
  })

  test('render root with one child', () => {
    expect(graph.nodes.length).toBe(2)
    expect(graph.nodes[0].data.name).toBe('root')
    expect(graph.nodes[1].data.name).toBe('a')

    expect(graph.links.length).toBe(1)
    expect(graph.links[0].source.data.name).toBe('root')
    expect(graph.links[0].target.data.name).toBe('a')
  })

  test('remove non-existing leaf throws error', () => {
    expect(() =>
      graph.remove('root/z')
    ).toThrow('Path root/z not found')
  })

  test('add node to root', () => {
    graph.addNode('root/a/b')

    expect(graph.nodes).toHaveLength(3)
    expect(graph.nodes[0].data.name).toBe('root')
    expect(graph.nodes[1].data.name).toBe('a')
    expect(graph.nodes[2].data.name).toBe('b')

    expect(graph.links).toHaveLength(2)
    expect(graph.links[0].source.data.name).toBe('root')
    expect(graph.links[0].target.data.name).toBe('a')
  })

  test('add node to non-existing parent throws error', () => {
    expect(() => {
      graph.addNode('bla/a')
    }).toThrow('Parent not found for bla/a: bla')
  })

  test.skip('modify existing file updates color', async () => {
    graph.modify('root/a')

    // wait for transition to be completed
    await new Promise(resolve => setTimeout(resolve, 1000))

    const circles = graph.nodeContainer.selectChildren().nodes() as SVGAElement[]
    expect(circles).toHaveLength(2)

    expect(circles[0].getAttribute('fill')).toBe('#000')
    expect(circles[1].getAttribute('fill')).toBe('rgb(255, 0, 0)')
  })

  test('modify non-existing file throws error', async () => {
    expect(() => {
      graph.modify('root/b')
    }).toThrow('Node root/b not found')
  })
})

test('remove a leaf node', () => {
  const tree: Tree = {
    name: 'root',
    path: 'root',
    children: [
      {
        name: 'a',
        path: 'root/a',
        children: [
          {
            name: 'b',
            path: 'root/a/b',
            children: []
          },
          {
            name: 'c',
            path: 'root/a/c',
            children: []
          }
        ]
      }
    ]
  }

  const graph = new ForceDirectedGraph(tree)
  expect(graph.nodes).toHaveLength(4)
  expect(graph.links).toHaveLength(3)

  graph.remove('root/a/b')

  expect(graph.nodes).toHaveLength(3)
  expect(graph.nodes[0].data.name).toBe('root')
  expect(graph.nodes[1].data.name).toBe('a')
  expect(graph.nodes[2].data.name).toBe('c')

  expect(graph.links).toHaveLength(2)
})
