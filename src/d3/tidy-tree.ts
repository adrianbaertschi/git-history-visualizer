import * as d3 from "d3";
import {HierarchyNode, HierarchyPointLink, HierarchyPointNode} from "d3";
import {dummyData, Tree} from "./file-parser";


export default () => {
    const mydata = dummyData;

    // set the dimensions and margins of the diagram
    const margin = {top: 20, right: 120, bottom: 30, left: 90};
    const width = 660 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);
    const container = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    const pathContainer = container.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    update(mydata)

    function update(data: Tree) {
        const rootNode: HierarchyNode<Tree> = d3.hierarchy(data);
        let nodes = d3.tree().size([height, width])(rootNode);

        pathContainer.selectAll("path")
            .data(nodes.links(), (d: HierarchyPointLink<Tree>) => `${d.target.data.name}`)
            .enter().append("path")
            .attr("d", d3.linkHorizontal()
                .x((d: any) => d.y)
                .y((d: any) => d.x) as any);

        // adds each node as a group
        const node = container.selectAll(".node")
            .data(nodes.descendants(), (d: HierarchyPointNode<Tree>) => d.data.name);

        node.exit().remove();

        const nodeContainer = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", d => `translate(${d.y},${d.x})`);

        // adds the circle to the node
        nodeContainer.append("circle")
            .attr("r", 2.5)
            .style("fill", "#555");

        // adds the text to the node
        nodeContainer.append("text")
            .attr("dy", ".35em")
            .attr("x", d => d.children ? -6 : 6)
            .style("text-anchor", d => d.children ? "end" : "start")
            .text((d: any) => d.data.name);
    }

    d3.select("body").append("button").text("Add")
        .on("click", () => {
            console.log("Add");
            mydata.children[1].children.push({name: `${Date.now()}`})
            update(mydata)
        });
};
