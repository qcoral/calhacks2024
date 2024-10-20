import * as d3 from "d3";
import { useEffect, useRef } from "react";

export default function StaticGraph({
  data,
  width = 1500,
  height = 1000,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 20,
  marginLeft = 20
}) {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Clear previous content
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(20))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", "steelblue")
      .call(drag(simulation))
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("mousemove", handleMouseMove);

    const label = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(data.nodes)
      .join("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("dy", -10)
      .text(d => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
    });

    function drag(simulation) {
      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    }

    function handleMouseOver(event, d) {
      d3.select(this).attr("fill", "orange");
    }

    function handleMouseOut(event, d) {
      d3.select(this).attr("fill", "steelblue");
    }

    function handleMouseMove(event, d) {
      // You can add custom behavior here, such as displaying a tooltip
    }
  }, [data, height, width]);

  return <svg ref={svgRef}></svg>;
}