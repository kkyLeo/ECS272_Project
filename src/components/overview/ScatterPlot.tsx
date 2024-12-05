import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

interface ScatterPlotProps {
    data: { x: number; y: number; name: string }[];
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Set dimensions
        const width = 500;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };

        // Create scales
        const xScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.x) || 0])
            .range([margin.left, width - margin.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(data, d => d.y) || 0])
            .range([height - margin.bottom, margin.top]);

        // Select SVG and clear previous contents
        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Create axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale));

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale));

        // Plot points
        svg.selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', d => xScale(d.x))
            .attr('cy', d => yScale(d.y))
            .attr('r', 5)
            .attr('fill', 'steelblue')
            .attr('stroke', 'white')
            .attr('stroke-width', 1);
    }, [data]);

    return <svg ref={svgRef} width={500} height={400} style={{ backgroundColor: '#f9f9f9' }} />;
};

export default ScatterPlot;
