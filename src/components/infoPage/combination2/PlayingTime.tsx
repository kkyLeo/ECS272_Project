import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { csv } from 'd3-fetch';
import { InfoProps, PlaytimeData } from '../../../types';

interface PlaytimeHeatMapProps extends InfoProps {
    selectedPlatforms: string[];
}

const PlatformPlaytimeHeatMap: React.FC<PlaytimeHeatMapProps> = ({ gameName, selectedPlatforms }) => {
    const [gameData, setPlaytimeData] = useState<PlaytimeData[]>([]);
    const heatmapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadPlaytimeData = async () => {
            try {
                const csvData = await csv('../../data/GamesPlatform.csv');
                const filteredData = csvData.filter((d) => d.Title === gameName);
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
    }, [gameData, selectedPlatforms]);

    function drawHeatMap() {
        if (!heatmapRef.current) return;

        const margin = { top: 40, right: 20, bottom: 80, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(heatmapRef.current).selectAll('*').remove();

        const svg = d3.select(heatmapRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const platforms = gameData.map((d) => d.Platform);
        const playtimeTypes = ['MainStory', 'MainSides', 'Completionist', 'Fastest', 'Slowest'];

        const xScale = d3.scaleBand().domain(playtimeTypes).range([0, width]).padding(0.05);
        const yScale = d3.scaleBand().domain(platforms).range([0, height]).padding(0.05);

        const allValues = gameData.flatMap(d => [d.MainStory, d.MainSides, d.Completionist]);
        const sortedValues = allValues.sort((a, b) => a - b);
        const percentile5Index = Math.floor(sortedValues.length * 0.05);
        const percentile5Value = sortedValues[percentile5Index];
        const percentile95Index = Math.floor(sortedValues.length * 0.95);
        const percentile95Value = sortedValues[percentile95Index];

        const normalPlaytimeColorScale = d3.scaleSequential()
            .domain([percentile5Value, percentile95Value])
            .interpolator(d3.interpolateBlues)
            .clamp(true);

        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .style('fill', 'white');

        svg.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', 'white');

        playtimeTypes.forEach((playtimeType) => {
            gameData.forEach((d) => {
                const value = +d[playtimeType as keyof PlaytimeData];
                const x = xScale(playtimeType)!;
                const y = yScale(d.Platform)!;

                let fillColor;

                if (selectedPlatforms.length === 0 || selectedPlatforms.includes(d.Platform)) {
                    if (playtimeType === 'Fastest') {
                        fillColor = value > 0 ? '#FFFF00' : 'none';
                    } else if (playtimeType === 'Slowest') {
                        fillColor = value > 0 ? '#FF0000' : 'none';
                    } else {
                        fillColor = normalPlaytimeColorScale(value);
                    }
                } else {
                    fillColor = 'none'; // Make unselected cells transparent
                }

                svg.append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', xScale.bandwidth())
                    .attr('height', yScale.bandwidth())
                    .attr('fill', fillColor as string)
                    .attr('stroke', selectedPlatforms.length === 0 || selectedPlatforms.includes(d.Platform) ? '#333' : 'none'); // Hide border if transparent

                svg.append('text')
                    .attr('x', x + xScale.bandwidth() / 2)
                    .attr('y', y + yScale.bandwidth() / 2)
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .attr('fill', selectedPlatforms.length === 0 || selectedPlatforms.includes(d.Platform) ? 'black' : 'none')
                    .style('font-size', '12px')
                    .style('font-weight', 'bold')
                    .text(value);
            });
        });

        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('fill', 'white')
            .style('font-weight', 'bold')
            .text('Platform Playtime Heat Map');
    }

    return (
        <div ref={heatmapRef} className='heatmap-container' style={{ width: '100%', height: '500px' }}>
        </div>
    );
};

export default PlatformPlaytimeHeatMap;
