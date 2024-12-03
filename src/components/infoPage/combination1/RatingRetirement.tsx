import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { InfoProps, ComponentSize, Margin, RatingRetirementGameData } from '../../../types';

const RatingAndRetirementPieChart: React.FC<InfoProps> = ({ gameName }) => {
    const [gameData, setRatingRetirementGameData] = useState<RatingRetirementGameData | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<ComponentSize>({ width: 0, height: 0 });
    const margin: Margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const onResize = useDebounceCallback((size: ComponentSize) => setSize(size), 200);
    useResizeObserver({ ref: chartRef, onResize });

    useEffect(() => {
        // Load CSV data asynchronously using d3.csv
        const loadRatingRetirementGameData = async () => {
            try {
                const csvData = await d3.csv('../../data/GamesInfo.csv', d => {
                    // Removing the '%' symbol and converting to a number
                    const averageRating = d['Average Rating'] ? parseFloat(d['Average Rating'].replace('%', '')) : 0;
                    const retirementRate = d['Retirement'] ? parseFloat(d['Retirement'].replace('%', '')) : 0;

                    return {
                        title: d.Title,
                        averageRating,
                        retirementRate,
                    };
                });

                // Find the game with the matching title
                const foundGame = csvData.find(game => game.title === gameName);
                setRatingRetirementGameData(foundGame || null);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        if (gameName) {
            loadRatingRetirementGameData();
        }
    }, [gameName]);

    useEffect(() => {
        if (!gameData) return;
        if (size.width === 0 || size.height === 0) return;

        // Clear previous SVG elements before rendering new ones
        d3.select('#average-rating-pie').selectAll('*').remove();
        d3.select('#retirement-rate-pie').selectAll('*').remove();

        drawPieChart('average-rating-pie', gameData.averageRating, 'Average Rating', 'Rating', '#3b82f6');
        drawPieChart('retirement-rate-pie', gameData.retirementRate, 'Retirement Rate', 'Retirement', '#10b981');
    }, [gameData, size]);

    function drawPieChart(containerId: string, value: number, label: string, labelSuffix: string, color: string) {
        const chartContainer = d3.select(`#${containerId}`);
        const chartWidth = size.width / 2 - margin.left - margin.right;
        const chartHeight = size.height / 2 - margin.top - margin.bottom;
        const radius = Math.min(chartWidth, chartHeight) / 2;

        const pieData = [value, 100 - value];

        const pie = d3.pie<number>().sort(null);
        const arc = d3.arc<d3.PieArcDatum<number>>().innerRadius(radius - 20).outerRadius(radius);

        const chart = chartContainer
            .append('g')
            .attr('transform', `translate(${chartWidth / 2 + margin.left}, ${chartHeight / 2 + margin.top})`);

        chart.selectAll('path')
            .data(pie(pieData))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', (d, i) => (i === 0 ? color : '#333'));

        // Add text label in the center
        chart.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.2em')
            .attr('fill', 'white')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .text(`${Math.round(value)}%`);

        // Add descriptive label below percentage
        chart.append('text')
            .attr('text-anchor', 'middle')
            .attr('dy', '2.5em')
            .attr('fill', 'white')
            .style('font-weight', 'bold')
            .style('font-size', '14px')
            .text(labelSuffix);
    }

    return (
        <div ref={chartRef} className='chart-container' style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            {/* Container for Average Rating Pie Chart */}
            <div style={{ width: '50%', textAlign: 'center' }}>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>Overall Rating</h3>
                <svg id='average-rating-pie' width='100%' height='100%'></svg>
            </div>

            {/* Container for Retirement Rate Pie Chart */}
            <div style={{ width: '50%', textAlign: 'center' }}>
                <h3 style={{ color: 'white', marginBottom: '10px' }}>Overall Retirement</h3>
                <svg id='retirement-rate-pie' width='100%' height='100%'></svg>
            </div>
        </div>
    );
};

export default RatingAndRetirementPieChart;
