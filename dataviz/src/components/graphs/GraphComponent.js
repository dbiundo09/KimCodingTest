import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { capitalizeFirstLetter } from '../../util/GeneralUtil';

/* 
    Graph Component:

    data: [Object]           // An array of objects that represents a CSV in object form, with each object representing a row of the csv. 

    Example:

    {company: 'Tim Hortons', stores: 4671, revenue: 3.16},
    {company: 'Panera Bread', stores: 1880, revenue: 2.53}
    {company: 'Costa Coffee', stores: 3080, revenue: 1.21}
    
    
    xAxisLabel: String      // The string representing the key that should be used for xAxis data.
    
    Example:

    "stores" or "revenue"


    yAxisLabel: String      // The string representing the key that should be used for yAxis data.

    Example:

    "company"

    sortingFunction: [Obj] => [Obj] // A function that takes an array and returns another sorted version of array

    Example:


*/

const GraphComponent = ({ data, xAxisLabel, yAxisLabel, sortingFunction }) => {
    // Ref to the SVG element
    const svgRef = useRef();
    const [initialRender, setInitialRender] = useState(true);



    useEffect(() => {

        console.log("Initial Render");
        // Clear previous chart content
        d3.select(svgRef.current).selectAll('*').remove();


        const tooltip = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

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
        var formattedData = sortingFunction(data, yAxisLabel);

        // Create scales
        const xScale = d3.scaleBand().domain(formattedData.map((d) => d[xAxisLabel])).range([0, width]).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, d3.max(formattedData, (d) => d[yAxisLabel])]).range([height, 0]);


        //Create bar
        const bars = svg
            .selectAll('rect')
            .data(formattedData)
            .enter()
            .append('rect')
            .attr('x', (d) => xScale(d[xAxisLabel]))
            .attr('y', height) 
            .attr('width', xScale.bandwidth())
            .attr('height', 0) 
            .attr('fill', 'blue')
            .on('mouseover', function (event, d) {
                tooltip.transition().duration(400).style('opacity', 0.9);
                tooltip.html(`${yAxisLabel}: ${d[yAxisLabel]}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function () {
                tooltip.transition().duration(500).style('opacity', 0);
            });

        // Transition the bars to their final position and height
        bars.transition()
            .duration(1000)
            .attr('y', (d) => yScale(d[yAxisLabel]))
            .attr('height', (d) => height - yScale(d[yAxisLabel]));



        // Add x-axis with transition
        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .transition()
            .duration(1000)
            .selectAll('text')
            .style('font-size', '10px'); 

        // Add x-axis label
        svg.append('text')
            .attr('x', width + 50)
            .attr('y', height) 
            .style('text-anchor', 'middle')
            .text(capitalizeFirstLetter(xAxisLabel));

        // Add y-axis with transition
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .transition()
            .duration(1000)
            .attr('class', 'y-axis');

        // Add y-axis label
        svg.append('text')
            .attr('x', 0)
            .attr('y', -margin.top + 20) 
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .attr('class','y-title')
            .text(capitalizeFirstLetter(yAxisLabel));


        //Function for updating the sorting. Rearranges the X axis according to the new order and animates it
        const update = (sortingFunction, currentYLabel) => {
            formattedData = sortingFunction(formattedData, currentYLabel);


            const t = svg
                .transition()
                .duration(750);

            // Update x-axis and domain based on the new sorting function
            xScale.domain(sortingFunction(formattedData, currentYLabel).map((d) => d[xAxisLabel]));

            // Transition x-axis
            svg.select('g').transition(t).duration(1000).call(d3.axisBottom(xScale));

            // Transition bars to new x positions
            bars.data(formattedData, (d) => d[xAxisLabel])
                .transition(t)
                .delay((d, i) => i * 20)
                .attr('x', (d) => xScale(d[xAxisLabel]));

        };

        //Function for updating the set of data that is being used for the yAxis. Creates a new range of data and animates the transition.
        const updateYLabel = (newYLabel) => {
            console.log("Updating y Label");
            console.log("Formatted Data, ", formattedData);

            const t = svg.transition().duration(1000);

            // Create a new y-scale with the new yLabel
            const newyScale = d3.scaleLinear().domain([0, d3.max(formattedData, (d) => d[newYLabel])]).range([height, 0]);

            // Create or select the y-axis group
            let yAxisGroup = svg.select('.y-axis');
            if (yAxisGroup.empty()) {
                yAxisGroup = svg.append('g').attr('class', 'y-axis');
            }

            // Transition the y-axis group
            yAxisGroup.transition(t).call(d3.axisLeft(newyScale));

            // Transition the bars to their final position and height
            bars.transition(t)
                .attr('y', (d) => newyScale(d[newYLabel]))
                .attr('height', (d) => height - newyScale(d[newYLabel]));

            bars.on('mouseover', function (event, d) {
                tooltip.transition().duration(400).style('opacity', 0.9);
                tooltip.html(`${newYLabel}: ${d[newYLabel]}`)
                    .style('left', (event.pageX) + 'px')
                    .style('top', (event.pageY) + 'px');


            });

            svg
                .select('.y-title')
                .transition(t)
                .text(capitalizeFirstLetter(newYLabel));
        };






        svgRef.update = update;
        svgRef.updateYLabel = updateYLabel;

        setInitialRender(false);

    }, [xAxisLabel]);


    //Function for updating sortingFunction
    React.useEffect(() => {
        if (!initialRender) {
            svgRef.update(sortingFunction, yAxisLabel);
        }
    }, [data, sortingFunction]);


    //Function for updating yAxisLabel
    React.useEffect(() => {
        if (!initialRender) {
            svgRef.updateYLabel(yAxisLabel);

            //After completion, calls the sortingFunction update in order to maintain the correct order
            d3.select(svgRef.current).select('.y-axis').transition().on('end', () => {
                setTimeout(() => {

                    svgRef.update(sortingFunction, yAxisLabel);
                }, 1000);
            });
        }
    }, [yAxisLabel]);



    return <svg ref={svgRef}></svg>;
};

export default GraphComponent;
