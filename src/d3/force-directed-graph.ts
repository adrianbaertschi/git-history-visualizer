import * as d3 from "d3";
import {HierarchyNode, HierarchyPointLink, HierarchyPointNode, Simulation} from "d3";
import {demoData, Tree} from "./file-parser";


export default () => {
    const margin = {top: 20, right: 120, bottom: 30, left: 90};
    const width = 660 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const root: HierarchyNode<Tree> = d3.hierarchy(demoData());
    const tree = d3.tree<Tree>().size([height, width])(root);
    const links: HierarchyPointLink<Tree>[] = tree.links();
    const nodes: HierarchyPointNode<Tree>[] = tree.descendants();


    const simulation: Simulation<HierarchyPointNode<Tree>, undefined> = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.index).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

    const svg = d3.select("body").append("svg")
        .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line");

    const node = svg.append("g")
        .attr("fill", "#0099ff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("fill", d => d.children ? null : "#000")
        .attr("stroke", d => d.children ? null : "#000")
        .attr("r", 3.5)
        .call(drag(simulation));

    node.append("title")
        .text(d => d.data.name);

    simulation.on("tick", () => {
        link
            .attr("x1", (d: any) => d.source.x)
            .attr("y1", (d: any) => d.source.y)
            .attr("x2", (d: any) => d.target.x)
            .attr("y2", (d: any) => d.target.y);

        node
            .attr("cx", (d: any) => d.x)
            .attr("cy", (d: any) => d.y);
    });
}

const drag = (simulation: Simulation<HierarchyPointNode<Tree>, undefined>): any => {

    function dragStarted(event: any) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }

    function dragEnded(event: any) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }

    return d3.drag()
        .on("start", dragStarted)
        .on("drag", dragged)
        .on("end", dragEnded);
}