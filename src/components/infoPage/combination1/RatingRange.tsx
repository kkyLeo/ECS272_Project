import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { InfoProps, RatingData, ComponentSize, Margin } from '../../../types';

const RatingDistributionBarChart: React.FC<InfoProps> = ({ gameName }) => {
    const [gameData, setRatingData] = useState<RatingData[]>([]);
    const barRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<ComponentSize>({ width: 0, height: 0 });
    const margin: Margin = { top: 40, right: 20, bottom: 100, left: 60 };

    const onResize = useDebounceCallback((size: ComponentSize) => setSize(size), 200);
    useResizeObserver({ ref: barRef, onResize });

    useEffect(() => {
        // Load CSV data asynchronously using d3.csv
        const loadRatingData = async () => {
            try {
                const csvData = await d3.csv('../../data/GamesInfo.csv', d => {
                    return {
                        title: d.Title,
                        ratingDistribution: [
                            { category: '100', value: +d['Rating_100'] },
                            { category: '90', value: +d['Rating_90'] },
                            { category: '80', value: +d['Rating_80'] },
                            { category: '70', value: +d['Rating_70'] },
                            { category: '60', value: +d['Rating_60'] },
                            { category: '50', value: +d['Rating_50'] },
                            { category: '40', value: +d['Rating_40'] },
                            { category: '30', value: +d['Rating_30'] },
                            { category: '20', value: +d['Rating_20'] },
                            { category: '10', value: +d['Rating_10'] },
                        ]
                    };
                });

                // Find the game with the matching title
                const foundGame = csvData.find(game => game.title === gameName);
                setRatingData(foundGame ? foundGame.ratingDistribution : []);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        if (gameName) {
        loadRatingData();
        }
    }, [gameName]);

    useEffect(() => {
        if (!gameData.length) return;
        if (size.width === 0 || size.height === 0) return;

        // Clear previous SVG elements before rendering new ones
        d3.select('#bar-svg').selectAll('*').remove();
        initChart();
    }, [gameData, size]);

    function initChart() {
        if (!gameData.length) return;

        const chartContainer = d3.select('#bar-svg');
        const chartHeight = size.height - margin.top - margin.bottom;
        const chartWidth = size.width - margin.left - margin.right;

        // Prepare scales for X and Y axes
        const yMax = d3.max(gameData, d => d.value) || 0;
        const xCategories: string[] = gameData.map((d: RatingData) => d.category);

        const xScale = d3.scaleBand()
            .range([0, chartWidth])
            .domain(xCategories)
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .range([chartHeight, 0])
            .domain([0, yMax]);

        // Define a color scale with gradual change
        const colorScale = d3.scaleSequential(d3.interpolateBlues)
            .domain([0, gameData.length - 1])
            .interpolator(d3.interpolateViridis);

        const chart = chartContainer.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Draw X axis
        chart.append('g')
            .attr('transform', `translate(0, ${chartHeight})`)
            .call(d3.axisBottom(xScale).tickFormat(d => `${d}%`))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .attr('dx', '-0.5em')
            .attr('dy', '0.5em')
            .style('text-anchor', 'end')
            .style('fill', 'white');

        // Draw Y axis
        chart.append('g')
            .call(d3.axisLeft(yScale).tickFormat(d3.format('d')))
            .selectAll('text')
            .style('fill', 'white');

        // Draw bars
        chart.selectAll('.bar')
            .data(gameData)
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
            .data(gameData)
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

        // Add chart title
        chartContainer.append('text')
            .attr('x', size.width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text('Distribution of Ratings');
    }

    return (
        <div ref={barRef} className='chart-container' style={{ width: '100%', height: '400px' }}>
            <svg id='bar-svg' width='100%' height='100%'></svg>
        </div>
    );
};

export default RatingDistributionBarChart;
