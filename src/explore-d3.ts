import * as d3 from "d3";
import {demoData, Tree} from "./file-parser";


const dummyData = {
    name: "root",
    children: [
        {name: "child #1"},
        {
            name: "child #2",
            children: [
                {name: "grandchild #1"},
                {name: "grandchild #2"},
                {name: "grandchild #3"}
            ]
        }
    ]
};

// set the dimensions and margins of the diagram
const margin = {top: 20, right: 120, bottom: 30, left: 90};
const width = 660 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;


const data: Tree = dummyData;
const rootNode = d3.hierarchy(data);
let nodes = d3.tree().size([height, width])(rootNode);

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
const g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(nodes.links())
    .join("path")
    .attr("d", d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x) as any);

// adds each node as a group
const node = g.selectAll(".node")
    .data(nodes.descendants(), )
    .join("g")
    .attr("transform", d => `translate(${d.y},${d.x})`);

// adds the circle to the node
node.append("circle")
    .attr("r", 2.5)
    .style("fill", "#555");

// adds the text to the node
node.append("text")
    .attr("dy", ".35em")
    .attr("x", d => d.children ? -6 : 6)
    .style("text-anchor", d => d.children ? "end" : "start")
    .text((d: any) => d.data.name);
