import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import GroupedBarChart from './GroupedBarChart';

const Dashboard: React.FC = () => {
    const [mainCategory, setMainCategory] = useState<'backlogged' | 'completed' | 'rated' | 'retired'>('backlogged');
    const [categories, setCategories] = useState({
        backlogged: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number }[],
        completed: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number }[],
        rated: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number }[],
        retired: [] as { year: string; gameName: string; playTime: number; mainStoryTime: number }[],
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const loadCategory = async (filename: string) =>
                    await d3.csv(`../../data/${filename}.csv`, d => ({
                        year: d.Year as string,
                        gameName: d['Title'] as string,
                        playTime: +d['Average Playing'],
                        mainStoryTime: +d['Main Story'],
                    }));

                const backlogged = await loadCategory('Backlogged');
                const completed = await loadCategory('Completed');
                const rated = await loadCategory('Rated');
                const retired = await loadCategory('Retired');

                setCategories({ backlogged, completed, rated, retired });
            } catch (error) {
                console.error('Error loading CSV files:', error);
            }
        };

        loadData();
    }, []);

    const handleCategoryClick = (category: 'backlogged' | 'completed' | 'rated' | 'retired') => {
        setMainCategory(category);
    };

    const renderCategory = (category: 'backlogged' | 'completed' | 'rated' | 'retired', isMain: boolean) => (
        <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            style={{
                flex: isMain ? 4 : 1,
                margin: '10px',
                padding: '10px',
                backgroundColor: isMain ? '#333' : '#444',
                color: 'white',
                borderRadius: '10px',
                cursor: isMain ? 'default' : 'pointer',
                transition: 'flex 0.5s ease',
            }}
        >
            <h3 style={{ textAlign: 'center' }}>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
            <ol style={{ paddingLeft: '20px', maxHeight: isMain ? 'auto' : '150px', overflow: 'hidden' }}>
                {categories[category].slice(0, isMain ? undefined : 5).map((game, index) => (
                    <li key={index} style={{ marginBottom: '10px' }}>
                        <strong>{game.gameName}</strong>
                        {isMain && (
                            <GroupedBarChart
                                data={[
                                    { category: 'Average Playing', value: game.playTime },
                                    { category: 'Main Story', value: game.mainStoryTime },
                                ]}
                                width={400}
                                height={150}
                            />
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'row', padding: '20px', backgroundColor: '#282828' }}>
            {renderCategory('backlogged', mainCategory === 'backlogged')}
            {renderCategory('completed', mainCategory === 'completed')}
            {renderCategory('rated', mainCategory === 'rated')}
            {renderCategory('retired', mainCategory === 'retired')}
        </div>
    );
};

export default Dashboard;
