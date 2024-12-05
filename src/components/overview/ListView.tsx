import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import GroupedBarChart from './GroupedBarChart';

const ListView: React.FC = () => {
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [backloggedGames, setBackloggedGames] = useState<
        { year: string; gameName: string; playTime: number; mainStoryTime: number; logged: number }[]
    >([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const backloggedData = await d3.csv('../../data/Backlogged.csv', d => ({
                    year: d.Year as string,
                    gameName: d['Title'] as string,
                    playTime: +d['Average Playing'],
                    mainStoryTime: +d['Main Story'],
                    logged: +d['Logged'], // Assuming there's a "Logged" column in the CSV
                }));
                setBackloggedGames(backloggedData);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        loadData();
    }, []);

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(e.target.value);
    };

    const filteredBacklogged = selectedYear
        ? backloggedGames.filter(game => game.year === selectedYear)
        : [];

    return (
        <div style={{ padding: '20px', backgroundColor: '#282828', color: 'white', fontFamily: 'VT323', fontSize: '24px' }}>
            {/* Dropdown to select year */}
            <select
                onChange={handleYearChange}
                value={selectedYear || ""}
                style={{
                    backgroundColor: 'grey',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                }}
            >
                <option value="" disabled>Select a Year</option>
                {[...new Set(backloggedGames.map(game => game.year))].map(year => (
                    <option key={year} value={year}>
                        {year}
                    </option>
                ))}
            </select>

            {selectedYear && (
                <div>
                    <h3>Backlogged Games for {selectedYear}</h3>
                    {/* Vertical stack container */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '50vw' }}>
                        {filteredBacklogged.map((game, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '10px',
                                    backgroundColor: '#333',
                                    borderRadius: '10px',
                                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                                }}
                            >
                                {/* Left side: Game info */}
                                <div style={{ flex: 1, paddingRight: '20px' }}>
                                    <strong style={{ display: 'block', marginBottom: '10px' }}>
                                        {index + 1}. {game.gameName}
                                    </strong>
                                    <p style={{ margin: 0, color: '#bbb' }}>Logged: {game.logged}</p>
                                </div>

                                {/* Right side: Grouped bar chart */}
                                <div style={{ flex: 1 }}>
                                    <GroupedBarChart
                                        data={[
                                            { category: 'Avg', value: game.playTime },
                                            { category: 'Main', value: game.mainStoryTime },
                                        ]}
                                        width={400} // Adjusted to fit smaller space
                                        height={150}
                                        title='Avg Play Time v.s. Main Story Time'
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListView;
