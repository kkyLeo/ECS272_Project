import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { InfoProps, InfoGameData } from '../../types';

const TextInfo: React.FC<InfoProps> = ({ gameName }) => {
    const [gameData, setInfoGameData] = useState<InfoGameData | null>(null);

    useEffect(() => {
        // Load CSV data asynchronously using d3.csv
        const loadGameData = async () => {
            try {
                const csvData = await d3.csv<InfoGameData>('../../data/GamesInfo.csv', d => {
                // Transforming the data (if needed) or simply returning it as an object
                    return {
                        title: d.Title,
                        introduction: d.Introduction,
                        genres: d.Genres,
                        developer: d.Developer,
                        publisher: d.Publisher,
                        platforms: d.Platforms,
                        imageURL: d.ImageURL,
                    };
                });
    
                // Find the game with the matching title
                const foundGame = csvData.find(game => game.title === gameName);
                setInfoGameData(foundGame || null);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };
    
        loadGameData();
    }, [gameName]);
    

    if (!gameData) {
        return <div>Loading game details...</div>;
    }

    return (
        <div className="text-info">
        {gameData.imageURL && (
                <img
                    src={gameData.imageURL}
                    alt={`${gameData.title} cover`}
                    style={{ width: '400px', height: 'auto', marginBottom: '20px' }}
                />
            )}
        <h2>{gameData.title}</h2>
        <p><strong>Introduction:</strong> {gameData.introduction}</p>
        <p><strong>Genres:</strong> {gameData.genres}</p>
        <p><strong>Developer:</strong> {gameData.developer}</p>
        <p><strong>Publisher:</strong> {gameData.publisher}</p>
        <p><strong>Platforms:</strong> {gameData.platforms}</p>
        {/* Add more fields as needed */}
        </div>
    );
};

export default TextInfo;
