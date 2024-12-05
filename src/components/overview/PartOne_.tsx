import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import ScatterPlot from './ScatterPlot';

const PartOne_: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [backloggedGames, setBackloggedGames] = useState<{ year: string; gameName: string }[]>([]);
    const [scatterData, setScatterData] = useState<{ x: number; y: number; name: string }[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const backloggedData = await d3.csv('../../data/Backlogged.csv', d => ({
                    year: d.Year as string,
                    gameName: d['Title'] as string,
                }));
                setBackloggedGames(backloggedData);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        loadData();
    }, []);

    // Filter or generate scatter data when year changes
    useEffect(() => {
        if (selectedYear) {
            const filteredData = backloggedGames
                .filter(game => game.year === selectedYear)
                .map((game, index) => ({
                    x: index, // Example x value (you can replace it with another metric)
                    y: game.gameName.length, // Example y value (string length as a metric)
                    name: game.gameName,
                }));

            setScatterData(filteredData);
        }
    }, [selectedYear, backloggedGames]);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white' }}>
            {/* Dropdown for selecting year */}
            <select
                onChange={handleYearChange}
                value={selectedYear || ""}
                style={{ backgroundColor: 'grey', color: 'white', padding: '10px', borderRadius: '5px' }}
            >
                <option value="" disabled>Select a Year</option>
                {[...new Set(backloggedGames.map(game => game.year))].map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {/* Render ScatterPlot */}
            {scatterData.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Scatter Plot for {selectedYear}</h3>
                    <ScatterPlot data={scatterData} />
                </div>
            )}
        </div>
    );
};

export default PartOne_;
