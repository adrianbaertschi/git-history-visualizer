import * as d3 from "d3";
import {HierarchyNode, HierarchyPointLink, HierarchyPointNode, Simulation} from "d3";
import {Tree} from "./tree-builder";


export const ForceDirectedGraph = (data: Tree) => {
    const margin = {top: 20, right: 120, bottom: 30, left: 90};
    const width = 660 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // @ts-ignore
    this.addNode = (filepath: string) => {

        // add  src/main/java/marsrover
        // create new node marsrover
        // find src/main/java (from)
        console.log("Adding ", filepath)

        const fileName = filepath.split('/').pop() ?? 'not found';

        console.log(nodes)

        let parent = nodes.filter(n => n.data.name === fileName)[0];
        console.log(parent)

        const nodeToInsert: HierarchyPointNode<Tree> = Object.assign({}, nodes[1])
        nodeToInsert.data.name = fileName

        links.push({source: parent, target: nodeToInsert});
        nodes.push(nodeToInsert)

        update()
    };

    // @ts-ignore
    this.remove = (filepath: string) => {
        const fileName = filepath.split('/').pop()

        let nodeIndex = nodes.findIndex(n => n.data.name === fileName);
        nodes.splice(nodeIndex, 1);

        let linkIndex = links.findIndex(l => l.target.data.name === fileName);
        links.splice(linkIndex, 1);

        update()
    }

    d3.select("body").append("button").text("Add")
        .on("click", () => {
            const nodeToInsert: HierarchyPointNode<Tree> = Object.assign({}, nodes[1])
            nodeToInsert.data.name = new Date().getTime().toString()
            links.push({source: tree, target: nodeToInsert});
            nodes.push(nodeToInsert)

            update()
        });

    d3.select("body").append("button").text("Remove")
        .on("click", () => {
            nodes.pop();
            links.pop()

            update()
        });

    const svg = d3.select("body").append("svg")
        .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

    const linkContainer = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6);

    const nodeContainer = svg.append("g")
        .attr("fill", "#0099ff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)

    const root: HierarchyNode<Tree> = d3.hierarchy(data);
    const tree: HierarchyPointNode<Tree> = d3.tree<Tree>().size([height, width])(root);
    const links: HierarchyPointLink<Tree>[] = tree.links();
    const nodes: HierarchyPointNode<Tree>[] = tree.descendants();

    const simulation = d3.forceSimulation<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>(nodes)
        .force("link", d3.forceLink<HierarchyPointNode<Tree>, HierarchyPointLink<Tree>>(links).id(d => d.id ?? 'missing-id').distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    update()

    function update() {
        simulation.nodes(nodes);

        const link = linkContainer.selectAll("line")
            .data(links, (d: any) => d.target.data.name)
            .join("line");

        const node = nodeContainer.selectAll("circle")
            .data<HierarchyPointNode<Tree>>(nodes, (d: any) => d.data.name)
            .join("circle")
            .attr("fill", d => d.children ? null : "#000")
            .attr("stroke", d => d.children ? null : "#000")
            .attr("r", 3.5)
            .call(drag(simulation));

        node.append("title")
            .text(d => d.data.name);

        simulation.on("tick", () => {
            link
                .attr("x1", (d: HierarchyPointLink<Tree>) => d.source.x)
                .attr("y1", (d: HierarchyPointLink<Tree>) => d.source.y)
                .attr("x2", (d: HierarchyPointLink<Tree>) => d.target.x)
                .attr("y2", (d: HierarchyPointLink<Tree>) => d.target.y);

            node
                .attr("cx", (d: HierarchyPointNode<Tree>) => d.x)
                .attr("cy", (d: HierarchyPointNode<Tree>) => d.y);
        });

        simulation.alphaTarget(0.3).restart();
    }

    return this;
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