import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { csv } from 'd3-fetch';
import { InfoProps, PlayersNumberData } from '../../../types';

interface PlayersBarChartProps extends InfoProps {
    selectedPlatforms: string[];
    setSelectedPlatforms: (platforms: string[]) => void;
}

const PlatformPlayersBarChart: React.FC<PlayersBarChartProps> = ({ gameName, selectedPlatforms, setSelectedPlatforms }) => {
    const [gameData, setPlayersNumberData] = useState<PlayersNumberData[]>([]);
    const barChartRef = useRef<HTMLDivElement>(null);
    const legendRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPlayersNumberData = async () => {
            try {
                const csvData = await csv('/data/GamesPlatform.csv'); // Adjust the path as needed
                const filteredData = csvData.filter((d) => d.Title === gameName);
                const playersData: PlayersNumberData[] = filteredData.map((d) => ({
                    Platform: d.Platform,
                    Players: +d.Players,
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
            drawLegend();
        }
    }, [gameData, selectedPlatforms]);

    function drawBarChart() {
        if (!barChartRef.current) return;

        const margin = { top: 20, right: 50, bottom: 50, left: 150 };
        const barHeight = 30;
        const width = 600 - margin.left - margin.right;
        const height = gameData.length * barHeight + margin.top + margin.bottom;

        d3.select(barChartRef.current).selectAll('*').remove();

        const svg = d3.select(barChartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const platforms = gameData.map((d) => d.Platform);
        const players = gameData.map((d) => d.Players);

        const yScale = d3.scaleBand().domain(platforms).range([0, gameData.length * barHeight]).padding(0.2);
        const xMax = d3.max(players) || 0;
        const xScale = d3.scaleLinear().domain([0, xMax]).range([0, width]);

        const customColors = ['#8B0000', '#1E90FF', '#FF8C00', '#4B0082', '#006400', '#FFD700'];

        svg.append('g').call(d3.axisLeft(yScale)).selectAll('text').style('fill', 'white');
        svg.append('g')
            .attr('transform', `translate(0, ${gameData.length * barHeight})`)
            .call(d3.axisBottom(xScale).ticks(6))
            .selectAll('text')
            .style('fill', 'white');

        svg.selectAll('rect')
            .data(gameData)
            .enter()
            .append('rect')
            .attr('y', (d) => yScale(d.Platform)!)
            .attr('x', 0)
            .attr('height', yScale.bandwidth())
            .attr('width', (d) => xScale(d.Players))
            .attr('fill', (d, i) =>
                selectedPlatforms.length === 0 || selectedPlatforms.includes(d.Platform)
                    ? customColors[i % customColors.length]
                    : 'none' // Make unselected bars transparent
            );

        svg.selectAll('text.bar-label')
            .data(gameData)
            .enter()
            .append('text')
            .attr('class', 'bar-label')
            .attr('x', (d) => Math.min(xScale(d.Players) + 5, width - 50))
            .attr('y', (d) => yScale(d.Platform)! + yScale.bandwidth() / 2)
            .attr('text-anchor', 'start')
            .attr('dominant-baseline', 'middle')
            .attr('fill', (d: PlayersNumberData) =>
                selectedPlatforms.length === 0 || selectedPlatforms.includes(d.Platform) ? 'white' : 'none' // Hide label if transparent
            )
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text((d) => d.Players);
    }

    function drawLegend() {
        if (!legendRef.current) return;
    
        d3.select(legendRef.current).selectAll('*').remove();
    
        const platforms = gameData.map((d) => d.Platform);
        const customColors = ['#8B0000', '#1E90FF', '#FF8C00', '#4B0082', '#006400', '#FFD700'];
    
        // Create the legend container
        const legend = d3.select(legendRef.current)
            .append('div')
            .attr('class', 'legend-container')
            .style('display', 'flex')
            .style('flex-wrap', 'wrap') // Enable wrapping of legend items
            .style('gap', '10px') // Add some space between items
            .style('align-items', 'center');
    
        // Create individual legend items
        platforms.forEach((platform, i) => {
            const legendItem = legend.append('div')
                .attr('class', 'legend-item')
                .style('display', 'flex')
                .style('align-items', 'center')
                .style('cursor', 'pointer')
                .on('click', () => {
                    // Toggle selection of platform
                    const updatedPlatforms = selectedPlatforms.includes(platform)
                        ? selectedPlatforms.filter((p) => p !== platform)
                        : [...selectedPlatforms, platform];
                    setSelectedPlatforms(updatedPlatforms);
                });
    
            legendItem.append('div')
                .style('width', '20px')
                .style('height', '20px')
                .style('background-color', selectedPlatforms.includes(platform) ? customColors[i % customColors.length] : 'none')
                .style('border', `1px solid ${customColors[i % customColors.length]}`)
                .style('margin-right', '10px');
    
            legendItem.append('span')
                .style('color', 'white')
                .style('font-size', '14px')
                .text(platform);
        });
    }
    

    return (
        <div className='bar-chart-container' style={{ width: '100%', height: 'auto' }}>
            <h3 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
                Distribution of Players in Different Platforms
            </h3>
            <div ref={legendRef} style={{ marginTop: '20px' }}></div>
            <div ref={barChartRef}></div>
        </div>
    );
};

export default PlatformPlayersBarChart;
