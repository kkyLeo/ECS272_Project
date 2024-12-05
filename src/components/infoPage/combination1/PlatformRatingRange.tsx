import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { InfoProps, RatingData, ComponentSize, Margin } from '../../../types';

const PlatformRatingBarChart: React.FC<InfoProps> = ({ gameName }) => {
    const [platformRatingData, setPlatformRatingData] = useState<RatingData[]>([]);
    const barRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<ComponentSize>({ width: 0, height: 0 });
    const margin: Margin = { top: 70, right: 20, bottom: 100, left: 60 };

    const onResize = useDebounceCallback((size: ComponentSize) => setSize(size), 200);
    useResizeObserver({ ref: barRef, onResize });

    useEffect(() => {
        // Load CSV data asynchronously using d3.csv
        const loadPlatformRatingData = async () => {
            try {
                const csvData = await d3.csv('../../data/GamesInfo.csv', d => {
                    return {
                        title: d.Title,
                        platformRatingDistribution: [
                            { category: 'PC', value: d['PC'] ? +d['PC'] : 0 },
                            { category: 'PlayStation 5', value: d['PlayStation 5'] ? +d['PlayStation 5'] : 0 },
                            { category: 'Xbox Series X/S', value: d['Xbox Series X/S'] ? +d['Xbox Series X/S'] : 0 },
                            { category: 'Mac', value: d['Mac'] ? +d['Mac'] : 0 },
                            { category: 'Nintendo Switch', value: d['Nintendo Switch'] ? +d['Nintendo Switch'] : 0 },
                            { category: 'PlayStation 4', value: d['PlayStation 4'] ? +d['PlayStation 4'] : 0 },
                            { category: 'Xbox One', value: d['Xbox One'] ? +d['Xbox One'] : 0 },
                            { category: 'Amazon Luna', value: d['Amazon Luna'] ? +d['Amazon Luna'] : 0 },
                            { category: 'Google Stadia', value: d['Google Stadia'] ? +d['Google Stadia'] : 0 },
                            { category: 'Mobile', value: d['Mobile'] ? +d['Mobile'] : 0 },
                        ].filter(rating => rating.value !== 0), // Filter out entries with value 0
                    };
                });

                // Find the game with the matching title
                const foundGame = csvData.find(game => game.title === gameName);
                setPlatformRatingData(foundGame ? foundGame.platformRatingDistribution : []);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        if (gameName) {
            loadPlatformRatingData();
        }
    }, [gameName]);

    useEffect(() => {
        if (!platformRatingData.length) return;
        if (size.width === 0 || size.height === 0) return;

        // Clear previous SVG elements before rendering new ones
        d3.select('#platform-bar-svg').selectAll('*').remove();
        initChart();
    }, [platformRatingData, size]);

    function initChart() {
        if (!platformRatingData.length) return;

        const chartContainer = d3.select<SVGSVGElement, unknown>('#platform-bar-svg');
        const chartHeight = size.height - margin.top - margin.bottom;
        const chartWidth = size.width - margin.left - margin.right;

        // Prepare scales for X and Y axes
        const platformYMax = d3.max(platformRatingData, d => d.value) || 0;
        const platformCategories: string[] = platformRatingData.map((d: RatingData) => d.category);

        const platformXScale = d3.scaleBand()
            .range([0, chartWidth])
            .domain(platformCategories)
            .padding(0.1);

        const platformYScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, Math.ceil(platformYMax / 10) * 10]); // Adjust y-axis scale for platform ratings to nearest 10

        // Define a color scale with gradual change
        const platformColorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, platformRatingData.length - 1])
            .interpolator(d3.interpolateViridis);

        const chart = chartContainer.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Add chart title
        chartContainer.append('text')
            .attr('x', size.width / 2)
            .attr('y', margin.top / 2 - 5)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text('Platform Rating Distribution');

        // Draw bar chart (Platform Rating Distribution)
        drawBarChart(chart, platformXScale, platformYScale, platformColorScale, platformRatingData, chartHeight);
    }

    function drawBarChart(chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>, xScale: d3.ScaleBand<string>, yScale: d3.ScaleLinear<number, number>, colorScale: d3.ScaleSequential<string>, data: RatingData[], chartHeight: number) {
        // Draw X axis
        chart.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d => `${d}`))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .attr('dx', '-0.5em')
            .attr('dy', '0.5em')
            .style('text-anchor', 'end')
            .style('fill', 'white');

        // Draw Y axis
        chart.append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format('d')))
            .selectAll('text')
            .style('fill', 'white');

        // Draw bars
        chart.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (d: RatingData) => xScale(d.category)!)
            .attr('y', (d: RatingData) => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', (d: RatingData) => chartHeight - yScale(d.value))
            .attr('fill', (_, i) => colorScale(i));

        // Add permanent labels on top of each bar
        chart.selectAll('.bar-label')
            .data(data)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', (d: RatingData) => xScale(d.category)! + xScale.bandwidth() / 2)
            .attr('y', (d: RatingData) => yScale(d.value) - 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text((d: RatingData) => d.value);
    }

    return (
        <div ref={barRef} className='chart-container' style={{ width: '100%', height: '400px' }}>
            <svg id='platform-bar-svg' width='100%' height='100%'></svg>
        </div>
    );
};

export default PlatformRatingBarChart;
