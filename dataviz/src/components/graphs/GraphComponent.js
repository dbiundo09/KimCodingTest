import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { convertToGraphFormat } from '../../util/parsingFunctions';

const GraphComponent = ({ data, xAxisLabel, yAxisLabel, sortingFunction }) => {
    // Ref to the SVG element
    const svgRef = useRef();

    useEffect(() => {
        // Clear previous chart content
        d3.select(svgRef.current).selectAll('*').remove();

        // Set up dimensions and margins
        const width = 600;
        const height = 400;
        const margin = { top: 60, right: 100, bottom: 120, left: 120 }; // Adjusted margins

        // Create SVG element
        const svg = d3
            .select(svgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Initial formatting of data
        const formattedData = sortingFunction(convertToGraphFormat(xAxisLabel, yAxisLabel, data));

        // Create scales
        const xScale = d3.scaleBand().domain(formattedData.map((d) => d.xAxis)).range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, d3.max(formattedData, (d) => d.yAxis)]).range([height, 0]);

        // Create bars
        const bars = svg
            .selectAll('rect')
            .data(formattedData)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d.xAxis))
            .attr('y', height) // Start the bars at the bottom for the animation
            .attr('width', xScale.bandwidth())
            .attr('height', 0) // Start the bars with zero height
            .attr('fill', 'blue');

        // Transition the bars to their final position and height
        bars.transition()
            .duration(1000) // Set the duration of the animation in milliseconds
            .attr('y', (d) => yScale(d.yAxis))
            .attr('height', (d) => height - yScale(d.yAxis));

        // Add x-axis with transition
        svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .transition()
            .duration(1000)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('font-size', '10px'); // Adjust font-size dynamically

        svg.append('text')
            .attr('x', width + 50)
            .attr('y', height) // Adjust the position based on your preference
            .style('text-anchor', 'middle')
            .text(xAxisLabel);

        // Add y-axis with transition
        const yAxis = svg.append('g').call(d3.axisLeft(yScale))
            .transition()
            .duration(1000);

        // Add y-axis label
        svg.append('text')
            .attr('x', 0)
            .attr('y', -margin.top + 20)  // Adjust the position above the graph
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(yAxisLabel);

        // Add animation to y-axis ticks (font-size)
        yAxis.selectAll('text')
            .attr('font-size', 0) // Start with smaller font size
            .transition()
            .duration(1000)
            .attr('font-size', 12); // Final font size

    }, [yAxisLabel, xAxisLabel, data, sortingFunction]);

    return <svg ref={svgRef}></svg>;
};

export default GraphComponent;
