import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface GroupedBarChartProps {
    data: { category: string; value: number }[];
    width?: number;
    height?: number;
    title?: string; // New prop for the chart title
}

const GroupedBarChart: React.FC<GroupedBarChartProps> = ({ data, width = 400, height = 100, title = '' }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous contents
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Set margins
        const margin = { top: 40, right: 20, bottom: 40, left: 50 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create scales
        const yScale = d3
            .scaleBand()
            .domain(data.map(d => d.category))
            .range([0, innerHeight])
            .padding(0.2);

        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.value) || 0])
            .nice()
            .range([0, innerWidth]);

        // Find the largest value
        const maxValue = d3.max(data, d => d.value);

        // Draw axes
        const yAxis = d3.axisLeft(yScale);
        const xAxis = d3.axisBottom(xScale).ticks(5);

        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top + innerHeight})`)
            .call(xAxis)
            .selectAll('text') // Make axis text white and use VT323
            .style('font-size', '16px')
            .style('font-style', 'italic')
            .style('fill', 'white')
            .style('font-family', 'VT323');

        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .call(yAxis)
            .selectAll('text') // Make axis text white and use VT323
            .style('font-size', '16px')
            .style('font-style', 'italic')
            .style('fill', 'white')
            .style('font-family', 'VT323');

        // Draw bars
        svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`)
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('y', d => yScale(d.category)!)
            .attr('x', 0)
            .attr('width', d => xScale(d.value))
            .attr('height', yScale.bandwidth())
            .attr('fill', d => (d.value === maxValue ? 'orange' : 'steelblue'));

        // Add chart title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('fill', 'white') // Set title text color to white
            .style('font-family', 'VT323') // Set font family to VT323
            .text(title);
    }, [data, width, height, title]);

    return <svg ref={svgRef} width={width} height={height} />;
};

export default GroupedBarChart;
