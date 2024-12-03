import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { csv } from 'd3-fetch';
import { InfoProps, PlayersNumberData } from '../../../types';

const PlatformPlayersBarChart: React.FC<InfoProps> = ({ gameName }) => {
    const [gameData, setPlayersNumberData] = useState<PlayersNumberData[]>([]);
    const barChartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load CSV data asynchronously using d3.csv
        const loadPlayersNumberData = async () => {
            try {
                const csvData = await csv('/data/GamesPlatform.csv'); // Adjust the path as needed

                // Filter the data for the selected game
                const filteredData = csvData.filter((d) => d.Title === gameName);

                // Extract relevant columns for the players information
                const playersData: PlayersNumberData[] = filteredData.map((d) => ({
                    Platform: d.Platform,
                    Players: +d.Players, // Convert to number
                }));

                setPlayersNumberData(playersData);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        if (gameName) {
            loadPlayersNumberData();
        }
    }, [gameName]);

    useEffect(() => {
        if (gameData.length > 0) {
            drawBarChart();
        }
    }, [gameData]);

    function drawBarChart() {
        if (!barChartRef.current) return;

        const margin = { top: 20, right: 50, bottom: 50, left: 150 };
        const barHeight = 30; // Fixed height per bar
        const width = 600 - margin.left - margin.right;
        const height = gameData.length * barHeight + margin.top + margin.bottom;

        // Clear previous SVG elements before rendering new ones
        d3.select(barChartRef.current).selectAll('*').remove();

        const svg = d3.select(barChartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Extracting unique platforms and their corresponding player counts
        const platforms = gameData.map((d) => d.Platform);
        const players = gameData.map((d) => d.Players);

        // yScale for platforms
        const yScale = d3.scaleBand()
            .domain(platforms)
            .range([0, gameData.length * barHeight])
            .padding(0.2);

        // xScale for number of players
        const xMax = d3.max(players) || 0;
        const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);

        // Custom color palette for platforms
        const customColors = ['#8B0000', '#1E90FF', '#FF8C00', '#4B0082', '#006400', '#FFD700'];
        const colorScale = (index: number) => customColors[index % customColors.length];

        // Draw y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', 'white');

        // Draw x-axis
        svg.append('g')
            .attr('transform', `translate(0, ${gameData.length * barHeight})`)
            .call(d3.axisBottom(xScale).ticks(6)) // Limit number of ticks for readability
            .selectAll('text')
            .style('fill', 'white');

        // Draw the bars for each platform
        svg.selectAll('rect')
            .data(gameData)
            .enter()
            .append('rect')
            .attr('y', (d) => yScale(d.Platform)!)
            .attr('x', 0)
            .attr('height', yScale.bandwidth())
            .attr('width', (d) => xScale(d.Players))
            .attr('fill', (d, i) => colorScale(i));

        // Add value labels to each bar
        svg.selectAll('text.bar-label')
            .data(gameData)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', (d) => Math.min(xScale(d.Players) + 5, width - 50)) // Ensure label stays within chart area
            .attr('y', (d) => yScale(d.Platform)! + yScale.bandwidth() / 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'middle')
            .attr('fill', 'white')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text((d) => d.Players);
    }

    return (
        <div ref={barChartRef} className='bar-chart-container' style={{ width: '100%', height: 'auto' }}>
        </div>
    );
};

export default PlatformPlayersBarChart;
