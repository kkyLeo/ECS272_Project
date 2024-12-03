import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';

const PartOne: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [backloggedGames, setBackloggedGames] = useState<{ year: string; gameName: string }[]>([]);
    const [completedGames, setCompletedGames] = useState<{ year: string; gameName: string }[]>([]);
    const [ratedGames, setRatedGames] = useState<{ year: string; gameName: string }[]>([]);
    const [retiredGames, setRetiredGames] = useState<{ year: string; gameName: string }[]>([]);
    const [filteredBacklogged, setFilteredBacklogged] = useState<string[]>([]);
    const [filteredCompleted, setFilteredCompleted] = useState<string[]>([]);
    const [filteredRated, setFilteredRated] = useState<string[]>([]);
    const [filteredRetired, setFilteredRetired] = useState<string[]>([]);
    const navigate = useNavigate();

    // Load data from CSVs
    useEffect(() => {
        const loadData = async () => {
            try {
                const backloggedData = await d3.csv('../../data/Backlogged.csv', d => ({
                    year: d.Year as string,
                    gameName: d['Title'] as string,
                }));
                setBackloggedGames(backloggedData);

                const completedData = await d3.csv('../../data//Completed.csv', d => ({
                    year: d.Year as string,
                    gameName: d['Title'] as string,
                }));
                setCompletedGames(completedData);

                const ratedData = await d3.csv('../../data//Rated.csv', d => ({
                    year: d.Year as string,
                    gameName: d['Title'] as string,
                }));
                setRatedGames(ratedData);

                const retiredData = await d3.csv('../../data//Retired.csv', d => ({
                    year: d.Year as string,
                    gameName: d['Title'] as string,
                }));
                setRetiredGames(retiredData);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        loadData();
    }, []);

    // Filter games based on selected year
    useEffect(() => {
        if (selectedYear) {
            const filteredBackloggedGames = backloggedGames
                .filter(game => game.year === selectedYear)
                .map(game => game.gameName);
            setFilteredBacklogged(filteredBackloggedGames);

            const filteredCompletedGames = completedGames
                .filter(game => game.year === selectedYear)
                .map(game => game.gameName);
            setFilteredCompleted(filteredCompletedGames);

            const filteredRatedGames = ratedGames
                .filter(game => game.year === selectedYear)
                .map(game => game.gameName);
            setFilteredRated(filteredRatedGames);

            const filteredRetiredGames = retiredGames
                .filter(game => game.year === selectedYear)
                .map(game => game.gameName);
            setFilteredRetired(filteredRetiredGames);
        }
    }, [selectedYear, backloggedGames, completedGames, ratedGames, retiredGames]);

    // Handle year change from dropdown
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    // Handle game click to navigate to part 2
    const handleGameClick = (gameName: string) => {
        navigate(`/game-info/${encodeURIComponent(gameName)}`);
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white' }}>
        {/* Dropdown Menu for Year Selection */}
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

        {/* Display Game Lists for the Selected Year */}
        {selectedYear && (
            <div style={{ marginTop: '20px' }}>
            <h3>Games from {selectedYear}</h3>

            <h4>Backlogged</h4>
            <ul>
                {filteredBacklogged.map((gameName, index) => (
                    <li key={index} onClick={() => handleGameClick(gameName)} style={{ cursor: 'pointer', color: '#00bcd4' }}>
                        {gameName}
                    </li>
                ))}
            </ul>

            <h4>Completed</h4>
            <ul>
                {filteredCompleted.map((gameName, index) => (
                    <li key={index} onClick={() => handleGameClick(gameName)} style={{ cursor: 'pointer', color: '#00bcd4' }}>
                        {gameName}
                    </li>
                ))}
            </ul>

            <h4>Rated</h4>
            <ul>
                {filteredRated.map((gameName, index) => (
                    <li key={index} onClick={() => handleGameClick(gameName)} style={{ cursor: 'pointer', color: '#00bcd4' }}>
                        {gameName}
                    </li>
                ))}
            </ul>

            <h4>Retired</h4>
            <ul>
                {filteredRetired.map((gameName, index) => (
                    <li key={index} onClick={() => handleGameClick(gameName)} style={{ cursor: 'pointer', color: '#00bcd4' }}>
                        {gameName}
                    </li>
                ))}
            </ul>
            </div>
        )}
        </div>
    );
};

export default PartOne;