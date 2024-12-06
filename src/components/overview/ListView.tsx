import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import GroupedBarChart from './GroupedBarChart';
import '../../styles/SliderStyle.css'; // Import the custom CSS for the slider

const ListView: React.FC = () => {
    const [currentDataset, setCurrentDataset] = useState<'backlogged' | 'completed' | 'rated' | 'retired'>('backlogged');
    const [datasets, setDatasets] = useState({
        backlogged: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number; logged: number; score: number; beat: number; retired: number }[],
        completed: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number; logged: number; score: number; beat: number; retired: number }[],
        rated: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number; logged: number; score: number; beat: number; retired: number }[],
        retired: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number; logged: number; score: number; beat: number; retired: number }[],
    });
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [transitionEffect, setTransitionEffect] = useState(false); // For animation

    const labels = {
        backlogged: 'Logged',
        completed: 'Beat',
        rated: 'Score',
        retired: 'Retired',
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const loadDataset = async (filename: string) =>
                    await d3.csv(`../../data/${filename}.csv`, d => ({
                        year: d.Year as string,
                        gameName: d['Title'] as string,
                        playTime: +d['Average Playing'],
                        mainStoryTime: +d['Main Story'],
                        logged: +d['Logged'],
                        score: +d['Score'],
                        beat: +d['Beat'],
                        retired: +d['Retired'],
                    }));

                const backlogged = await loadDataset('Backlogged');
                const completed = await loadDataset('Completed');
                const rated = await loadDataset('Rated');
                const retired = await loadDataset('Retired');

                setDatasets({ backlogged, completed, rated, retired });

                const years = Array.from(new Set(backlogged.map(game => game.year))).sort();
                setAvailableYears(years);
                setSelectedYear(years[0]); // Default year
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        loadData();
    }, []);

    // Handle switching datasets when clicking on side blocks
    const handleDatasetSwitch = (clickedDataset: 'backlogged' | 'completed' | 'rated' | 'retired') => {
        if (clickedDataset === currentDataset) return; // Prevent swapping the same dataset

        setTransitionEffect(true); // Start animation

        setTimeout(() => {
            setCurrentDataset(clickedDataset);
            setTransitionEffect(false); // End animation
        }, 500); // Duration of animation
    };

    // Handle keydown event to control the year slider
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (availableYears.length === 0) return;

            const currentIndex = availableYears.indexOf(selectedYear || '');
            if (event.key === 'ArrowRight') {
                if (currentIndex < availableYears.length - 1) {
                    setSelectedYear(availableYears[currentIndex + 1]);
                }
            } else if (event.key === 'ArrowLeft') {
                if (currentIndex > 0) {
                    setSelectedYear(availableYears[currentIndex - 1]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedYear, availableYears]);

    const filteredGames = (dataset: 'backlogged' | 'completed' | 'rated' | 'retired') =>
        selectedYear
            ? datasets[dataset].filter(game => game.year === selectedYear)
            : [];

    const sideBlocks = ['backlogged', 'completed', 'rated', 'retired'].filter(
        (dataset) => dataset !== currentDataset
    );

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: '100vh',
                backgroundColor: '#1e1e1e',
                color: 'white',
                fontFamily: 'VT323',
                fontSize: '24px',
                overflow: 'hidden',
            }}
        >
            {/* Main View */}
            <div
                style={{
                    flex: 3,
                    padding: '20px',
                    transform: transitionEffect ? 'scale(0.8)' : 'scale(1)',
                    opacity: transitionEffect ? 0 : 1,
                    transition: 'transform 0.5s ease, opacity 0.5s ease',
                }}
            >
                {/* Year Slider */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ marginRight: '10px' }}>Year:</label>
                    <input
                        type="range"
                        min="0"
                        max={availableYears.length - 1}
                        value={availableYears.indexOf(selectedYear || '')}
                        onChange={(e) => setSelectedYear(availableYears[+e.target.value])}
                        className="custom-slider" // Use the custom slider CSS
                    />
                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                        <strong>{selectedYear}</strong>
                    </div>
                </div>
                {/* Main List View */}
                {selectedYear && (
                    <div>
                        <h3 style={{ textAlign: 'center' }}>
                            {currentDataset.charAt(0).toUpperCase() + currentDataset.slice(1)} Games for {selectedYear}
                        </h3>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                maxHeight: 'calc(80vh - 80px)', // Adjust height dynamically
                                overflowY: 'auto',
                            }}
                        >
                            {filteredGames(currentDataset).map((game, index) => (
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
                                    <div style={{ flex: 1, paddingRight: '20px' }}>
                                        <strong>{index + 1}. {game.gameName}</strong>
                                        <p style={{ color: '#bbb' }}>
                                            {labels[currentDataset]}: 
                                            {currentDataset === 'rated' ? game.score :
                                            currentDataset === 'completed' ? game.beat :
                                            currentDataset === 'retired' ? game.retired :
                                            game.logged}
                                        </p>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <GroupedBarChart
                                            data={[
                                                { category: 'Avg', value: game.playTime },
                                                { category: 'Main', value: game.mainStoryTime },
                                            ]}
                                            width={300}
                                            height={110}
                                            title="Avg PlayTime v.s. Main Story Time"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Side Blocks */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'calc(10vh / 3)', paddingTop: '20vh' }}>
                {sideBlocks.map((dataset) => (
                    <div
                        key={dataset}
                        style={{
                            backgroundColor: '#444',
                            padding: '10px',
                            borderRadius: '10px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
                            cursor: 'pointer',
                            overflow: 'hidden',
                            maxHeight: 'calc((100vh - 40vh) / 3)', // Dynamically size blocks
                            transition: 'transform 0.3s ease, background-color 0.3s ease',
                        }}
                        onClick={() => handleDatasetSwitch(dataset as 'completed' | 'rated' | 'retired' | 'backlogged')}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#666')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#444')}
                    >
                        <h4 style={{ textAlign: 'center', fontSize: '20px' }}>
                            {dataset.charAt(0).toUpperCase() + dataset.slice(1) + " Games Ranking"}
                        </h4>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                                fontSize: '16px',
                                color: '#bbb',
                                maxHeight: 'calc((100vh - 60vh) / 3)', // Adjusted height
                                overflowY: 'auto',
                            }}
                        >
                            {filteredGames(dataset).slice(0, 5).map((game, index) => (
                                <p key={index} style={{ margin: 0, padding: '0 5px' }}>
                                    {index + 1}. {game.gameName}
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListView;
