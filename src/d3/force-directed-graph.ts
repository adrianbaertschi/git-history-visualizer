import * as d3 from "d3";
import {HierarchyNode, HierarchyPointLink, HierarchyPointNode, Simulation} from "d3";
import {Selection} from "d3-selection"
import {Tree} from "./tree-builder";


export class ForceDirectedGraph {
    simulation: d3.Simulation<d3.HierarchyPointNode<Tree>, d3.HierarchyPointLink<Tree>>;
    linkContainer: Selection<SVGGElement, unknown, HTMLElement, any>;
    nodeContainer: Selection<SVGGElement, unknown, HTMLElement, any>;
    nodes: HierarchyPointNode<Tree>[];
    links: HierarchyPointLink<Tree>[];

    constructor(data: Tree) {
        const margin = {top: 20, right: 120, bottom: 30, left: 90};
        const width = 660 - margin.left - margin.right;
        const height = 500 - margin.top - margin.bottom;

        d3.select("body").append("button").text("Add")
            .on("click", () => {
                const nodeToInsert: HierarchyPointNode<Tree> = Object.assign({}, this.nodes[1])
                nodeToInsert.data.name = new Date().getTime().toString()
                this.links.push({source: tree, target: nodeToInsert});
                this.nodes.push(nodeToInsert)

                this.update()
            });

        d3.select("body").append("button").text("Remove")
            .on("click", () => {
                this.nodes.pop();
                this.links.pop()

                this.update()
            });

        const svg = d3.select("body").append("svg")
            .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

        this.linkContainer = svg.append("g")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6);

        this.nodeContainer = svg.append("g")
            .attr("fill", "#0099ff")
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5)

        const root: HierarchyNode<Tree> = d3.hierarchy(data);
        const tree: HierarchyPointNode<Tree> = d3.tree<Tree>().size([height, width])(root);
        this.links = tree.links();
        this.nodes = tree.descendants();

        this.simulation = d3.forceSimulation<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>(this.nodes)
            .force("link", d3.forceLink<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>(this.links).id(d => d.id ?? 'missing-id').distance(0).strength(1))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("x", d3.forceX())
            .force("y", d3.forceY());

        this.update()
    }

    addNode(filepath: string) {
        const parentPath = filepath.substr(0, filepath.lastIndexOf("/"));
        const parent = this.nodes.filter(n => n.data.path === parentPath)[0]
        if (!parent) {
            throw `Parent not found for ${filepath}: ${parentPath}`
        }
        const fileName = filepath.split('/').pop() ?? 'not found';
        const data: Tree = {
            name: fileName,
            path: filepath
        }
        const nodeToInsert: HierarchyPointNode<Tree> = Object.assign({}, this.nodes[1])
        nodeToInsert.data = data

        this.nodes.push(nodeToInsert)
        this.links.push({source: parent, target: nodeToInsert});

        this.update()
    };

    remove(filepath: string) {
        const fileName = filepath.split('/').pop()

        let nodeIndex = this.nodes.findIndex(n => n.data.name === fileName);
        this.nodes.splice(nodeIndex, 1);

        let linkIndex = this.links.findIndex(l => l.target.data.name === fileName);
        this.links.splice(linkIndex, 1);

        this.update()
    }

    update() {
        this.simulation.nodes(this.nodes);

        const link = this.linkContainer.selectAll("line")
            .data(this.links, (d: any) => d.target.data.path)
            .join("line");

        const node = this.nodeContainer.selectAll("circle")
            .data<HierarchyPointNode<Tree>>(this.nodes, (d: any) => d.data.path)
            .join("circle")
            .attr("fill", d => d.children ? null : "#000")
            .attr("stroke", d => d.children ? null : "#000")
            .attr("r", 3.5)
            .call(drag(this.simulation));

        node.append("title")
            .text(d => d.data.path);

        this.simulation.on("tick", () => {
            link
                .attr("x1", (d: HierarchyPointLink<Tree>) => d.source.x)
                .attr("y1", (d: HierarchyPointLink<Tree>) => d.source.y)
                .attr("x2", (d: HierarchyPointLink<Tree>) => d.target.x)
                .attr("y2", (d: HierarchyPointLink<Tree>) => d.target.y);

            node
                .attr("cx", (d: HierarchyPointNode<Tree>) => d.x)
                .attr("cy", (d: HierarchyPointNode<Tree>) => d.y);
        });

        this.simulation.alphaTarget(0.3).restart();
    }
}

const drag = (simulation: Simulation<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>): any => {

    function dragStarted(event: any) {
        if (!event.active) {
            simulation.alphaTarget(0.3).restart();
        }
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnded(event: any) {
        if (!event.active) {
            simulation.alphaTarget(0);
        }
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}