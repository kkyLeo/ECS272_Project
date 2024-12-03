import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { csv } from 'd3-fetch';
import { InfoProps, PlaytimeData } from '../../../types';

const PlatformPlaytimeHeatMap: React.FC<InfoProps> = ({ gameName }) => {
    const [gameData, setPlaytimeData] = useState<PlaytimeData[]>([]);
    const heatmapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load CSV data asynchronously using d3.csv
        const loadPlaytimeData = async () => {
            try {
                const csvData = await csv('../../data/GamesPlatform.csv'); // Adjust the path as needed

                // Filter the data for the selected game
                const filteredData = csvData.filter((d) => d.Title === gameName);

                // Extract relevant columns for playtime information
                const playtimeData: PlaytimeData[] = filteredData.map((d) => ({
                    Platform: d.Platform,
                    MainStory: +d['Main Story'],
                    MainSides: +d['Main + Sides'],
                    Completionist: d.Completionist !== '-' ? +d.Completionist : 0,
                    Fastest: +d.Fastest,
                    Slowest: +d.Slowest,
                }));

                setPlaytimeData(playtimeData);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        if (gameName) {
            loadPlaytimeData();
        }
    }, [gameName]);

    useEffect(() => {
        if (gameData.length > 0) {
            drawHeatMap();
        }
    }, [gameData]);

    function drawHeatMap() {
        if (!heatmapRef.current) return;
    
        const margin = { top: 40, right: 20, bottom: 80, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
    
        // Clear previous SVG elements before rendering new ones
        d3.select(heatmapRef.current).selectAll('*').remove();
    
        const svg = d3.select(heatmapRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
    
        // Extracting unique platforms and playtime types
        const platforms = gameData.map((d) => d.Platform);
        const playtimeTypes = ['MainStory', 'MainSides', 'Completionist', 'Fastest', 'Slowest'];
    
        // xScale for playtime types
        const xScale = d3.scaleBand().domain(playtimeTypes).range([0, width]).padding(0.05);
    
        // yScale for platforms
        const yScale = d3.scaleBand().domain(platforms).range([0, height]).padding(0.05);
    
        // Flatten all playtime values to calculate percentiles for normal playtime types
        const allValues = gameData.flatMap(d => [d.MainStory, d.MainSides, d.Completionist]);
    
        // Calculate the 5th percentile and 95th percentile for the normal playtime types
        const sortedValues = allValues.sort((a, b) => a - b);
        const percentile5Index = Math.floor(sortedValues.length * 0.05);
        const percentile5Value = sortedValues[percentile5Index];
        const percentile95Index = Math.floor(sortedValues.length * 0.95);
        const percentile95Value = sortedValues[percentile95Index];
    
        // Define color scale for the normal playtime values, starting at a higher intensity to ensure visibility
        const normalPlaytimeColorScale = d3.scaleSequential()
            .domain([percentile5Value, percentile95Value])
            .interpolator(d3.interpolateBlues)
            .clamp(true); // Clamp to ensure values don't go outside the color range
    
        // Draw x-axis
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('fill', 'white');
    
        // Draw y-axis
        svg.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', 'white');
    
        // Draw the heat map cells with labels
        playtimeTypes.forEach((playtimeType) => {
            gameData.forEach((d) => {
                const value = +d[playtimeType as keyof PlaytimeData];
                const x = xScale(playtimeType)!;
                const y = yScale(d.Platform)!;
        
                let fillColor;
        
                // Use different colors for "Fastest" and "Slowest"
                if (playtimeType === 'Fastest') {
                    fillColor = value > 0 ? '#FFFF00' : '#333'; // Bright red for "Fastest"
                } else if (playtimeType === 'Slowest') {
                    fillColor = value > 0 ? '#FF0000' : '#333'; // Bright yellow for "Slowest"
                } else {
                    fillColor = normalPlaytimeColorScale(value); // Blue color for normal playtime types
                }
        
                // Draw the heatmap cell (rectangle)
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', xScale.bandwidth())
                    .attr('height', yScale.bandwidth())
                    .attr('fill', fillColor as string)
                    .attr('stroke', '#333'); // Add border for visual distinction
        
                // Draw the value in the center of the cell
                svg.append('text')
                    .attr('x', x + xScale.bandwidth() / 2)
                    .attr('y', y + yScale.bandwidth() / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', 'black')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text(value);
            });
        });
    
        // Add a title for the heatmap
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', 'white')
            .text('Platform Playtime Heat Map');
    }

    return (
        <div ref={heatmapRef} className='heatmap-container' style={{ width: '100%', height: '500px' }}>
        </div>
    );
};

export default PlatformPlaytimeHeatMap;
