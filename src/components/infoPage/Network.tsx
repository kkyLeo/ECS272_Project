import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { InfoProps, ComponentSize } from '../../types';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { NodeData, LinkData } from '../../types';

const GenreNetworkGraph: React.FC<InfoProps> = ({ gameName }) => {
    const [nodes, setNodes] = useState<NodeData[]>([]);
    const [links, setLinks] = useState<LinkData[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Set<string>>(new Set());
    const graphRef = useRef<HTMLDivElement>(null);
    const [size, setSize] = useState<ComponentSize>({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size: ComponentSize) => setSize(size), 200);
    useResizeObserver({ ref: graphRef, onResize });

    useEffect(() => {
        const loadGraphData = async () => {
            try {
                const csvData = await d3.csv('../data/GenresGames.csv');

                const nodesSet: Set<string> = new Set();
                const linksArray: LinkData[] = [];
                const relatedGenresSet: Set<string> = new Set();
                const relatedGamesSet: Set<string> = new Set();
                const allGenresOfCurrentGame: Set<string> = new Set();

                // Find the genres for the selected game
                csvData.forEach((d) => {
                    if (d.Title === gameName && d.Genres) {
                        relatedGenresSet.add(d.Genres);
                        allGenresOfCurrentGame.add(d.Genres);
                        nodesSet.add(d.Genres);
                    }
                });

                // Find all games that share the same genres
                csvData.forEach((d) => {
                    if (d.Genres && relatedGenresSet.has(d.Genres)) {
                        relatedGamesSet.add(d.Title);
                        nodesSet.add(d.Title);
                        nodesSet.add(d.Genres);
                        linksArray.push({ source: d.Title, target: d.Genres });
                    }
                });

                const nodesArray: NodeData[] = Array.from(nodesSet).map((id) => ({
                    id,
                    type: relatedGamesSet.has(id) ? 'game' : 'genre',
                    isCurrentGame: id === gameName,
                    sharesAllGenres: relatedGamesSet.has(id) && Array.from(allGenresOfCurrentGame).every(genre => csvData.find(d => d.Title === id && d.Genres === genre))
                }));

                setNodes(nodesArray);
                setLinks(linksArray);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        if (gameName) {
            loadGraphData();
        }
    }, [gameName]);

    useEffect(() => {
        if (nodes.length === 0 || links.length === 0 || size.width === 0 || size.height === 0) return;

        // Clear previous SVG elements before rendering new ones
        d3.select('#network-graph-svg').selectAll('*').remove();
        initGraph();
    }, [nodes, links, size]);

    useEffect(() => {
        updateGraphOpacity(selectedGenres);
    }, [selectedGenres]);

    useEffect(() => {
        d3.select(graphRef.current).selectAll('.legend-item')
            .style('color', (d: unknown) => {
                const genre = d as string; // Type assertion to let TypeScript know `d` is a string
                return selectedGenres.has(genre) ? 'yellow' : '#ff7f0e';
            });
    }, [selectedGenres]);

    function initGraph() {
        const chartContainer = d3.select<SVGSVGElement, unknown>('#network-graph-svg');
        const width = size.width - 40;
        const height = size.height - 40;

        // Create force simulation
        const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2));

        // Draw links
        const link = chartContainer.append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke-width', 1.5)
            .attr('stroke', '#999');

        // Draw nodes
        const node = chartContainer.append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('r', 8)
            .attr('fill', (d: NodeData) => {
                if (d.isCurrentGame) return 'red';
                if (d.sharesAllGenres) return 'green';
                return d.type === 'game' ? '#1f77b4' : '#ff7f0e';
            })
            .call(d3.drag()
                .on('start', (event, d: any) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = d.x;
                    d.fy = d.y;
                })
                .on('drag', (event, d: any) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d: any) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        // Add hover labels
        const label = chartContainer.append('g')
            .attr('class', 'labels')
            .selectAll('text')
            .data(nodes)
            .enter()
            .append('text')
            .attr('x', 12)
            .attr('y', 3)
            .style('fill', '#fff')
            .style('visibility', 'hidden')
            .text((d: NodeData) => d.id);

        node.on('mouseover', function (event, d) {
            d3.select(this).attr('stroke', 'white').attr('stroke-width', 2);
            label.filter(l => l.id === d.id).style('visibility', 'visible');
        })
            .on('mouseout', function (event, d) {
                d3.select(this).attr('stroke', null).attr('stroke-width', null);
                label.filter(l => l.id === d.id).style('visibility', 'hidden');
            });

        // Update simulation on tick
        simulation.on('tick', () => {
            link
                .attr('x1', (d: any) => d.source.x)
                .attr('y1', (d: any) => d.source.y)
                .attr('x2', (d: any) => d.target.x)
                .attr('y2', (d: any) => d.target.y);

            node
                .attr('cx', (d: any) => d.x)
                .attr('cy', (d: any) => d.y);

            label
                .attr('x', (d: any) => d.x + 12)
                .attr('y', (d: any) => d.y + 3);
        });

        const title = chartContainer.append('text')
            .attr('x', width / 2 + 20)
            .attr('y', 60)
            .attr('text-anchor', 'middle')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('fill', 'white')
            .text('Genres Connection Network Graph');

        // Add legend for genres
        const legendContainer = d3.select(graphRef.current)
            .append('div')
            .attr('class', 'legend-container')
            .style('position', 'absolute')
            .style('top', '60px')  // Adjusted value to move the legend below the title
            .style('right', '10px')
            .style('background', '#282828')
            .style('padding', '10px')
            .style('border-radius', '5px')
            .style('color', '#ff7f0e');


            legendContainer.selectAll('div')
                .data(Array.from(nodes.filter(n => n.type === 'genre').map(n => n.id)))
                .enter()
                .append('div')
                .attr('class', 'legend-item')
                .style('margin', '5px')
                .style('cursor', 'pointer')
                .style('font-weight', 'bold')
                .text(d => d)
                .style('color', d => selectedGenres.has(d) ? 'yellow' : '#ff7f0e') // Apply different colors to selected vs. unselected genres
                .on('click', (event, genre) => {
                    setSelectedGenres((prevSelectedGenres) => {
                        // Create a new Set to avoid direct mutation of state
                        const updatedGenres = new Set(prevSelectedGenres);

                        if (updatedGenres.has(genre)) {
                            updatedGenres.delete(genre); // Remove the genre if it is already selected
                        } else {
                            updatedGenres.add(genre); // Add the genre if it is not yet selected
                        }

                        return updatedGenres;
                    });
                });
        
    }

    function updateGraphOpacity(selectedGenres: Set<string>) {
        // Correctly select all nodes and links using the nested structure of the SVG.
        const allNodes = d3.select('#network-graph-svg').selectAll('.nodes circle');
        const allLinks = d3.select('#network-graph-svg').selectAll('.links line');
    
        if (selectedGenres.size === 0) {
            // Reset all nodes and links to full opacity when no genres are selected.
            allNodes.style('opacity', 1);
            allLinks.style('opacity', 1);
        } else {
            // Set all nodes and links to low opacity initially.
            allNodes.style('opacity', 0.1);
            allLinks.style('opacity', 0.1);
    
            // Find all games linked to all selected genres
            const gameToGenresMap = new Map<string, Set<string>>();
    
            // Iterate through all links to map each game to the genres it's connected to.
            allLinks.each(function (d: any) {
                if (d.source && d.target && d.target.type === 'genre') {
                    if (!gameToGenresMap.has(d.source.id)) {
                        gameToGenresMap.set(d.source.id, new Set());
                    }
                    const genresSet = gameToGenresMap.get(d.source.id);
                    if (genresSet) {
                        genresSet.add(d.target.id);
                    }
                }
            });
    
            // Find the games that are linked to all selected genres
            const relatedGames = new Set<string>();
            gameToGenresMap.forEach((genres, game) => {
                if (Array.from(selectedGenres).every((genre) => genres.has(genre))) {
                    relatedGames.add(game);
                }
            });
    
            // Set linked nodes and links to full opacity if they match the selected genres.
            allLinks.style('opacity', (d: any) => {
                if (relatedGames.has(d.source?.id) && selectedGenres.has(d.target?.id)) {
                    return 1; // Set link to full opacity.
                }
                return 0.1; // Set link to low opacity.
            });
    
            allNodes.style('opacity', (d: any) => {
                if (d.type === 'genre' && selectedGenres.has(d.id)) {
                    return 1; // Set selected genres to full opacity.
                }
                if (relatedGames.has(d.id)) {
                    return 1; // Set related game nodes to full opacity.
                }
                return 0.1; // Set other nodes to low opacity.
            });
        }
    }
    
    
    
    

    return (
        <div ref={graphRef} className='graph-container' style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg id='network-graph-svg' width='100%' height='100%'></svg>
        </div>
    );
};

export default GenreNetworkGraph;
