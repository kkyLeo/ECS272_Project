import React from 'react';
import Grid from '@mui/material/Grid';
import { useParams } from 'react-router-dom';
import TextInfo from './TextInfo';
import Combination1 from './combination1/Combination1';
import Combination2 from './combination2/Combination2';

const Layout: React.FC = () => {
    const { gameName } = useParams<{ gameName: string }>();
    const [selectedCombination, setSelectedCombination] = React.useState<string>('combination1');

    const handleCombinationSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCombination(e.target.value);
    };

    return (
        <Grid
            container
            spacing={2}
            id="main-container"
            style={{ backgroundColor: '#282828', minHeight: '100vh', padding: '20px' }}
        >
            {/* Back to Game Selection Button */}
            <Grid item xs={12} style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => window.history.back()}
                    style={{ padding: '10px', backgroundColor: 'grey', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Back to Game Selection
                </button>
            </Grid>

            {gameName && (
                <>
                    {/* Left Half: Game Text Information */}
                    <Grid item xs={12} md={6}>
                        <TextInfo gameName={gameName} />
                    </Grid>

                    {/* Right Half: Dropdown Menu & Visualizations */}
                    <Grid item xs={12} md={6}>
                        {/* Dropdown Menu for Combination Selection */}
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <select
                                onChange={handleCombinationSelection}
                                value={selectedCombination}
                                style={{ backgroundColor: 'grey', color: 'white', padding: '10px', borderRadius: '5px' }}
                            >
                                <option value="combination1">Rating & Retirement Analysis</option>
                                <option value="combination2">Platform Playtime & Players</option>
                            </select>
                        </div>

                        {/* Visualizations based on selected combination */}
                        {selectedCombination === 'combination1' ? (
                            <Combination1 gameName={gameName} />
                        ) : (
                            <Combination2 gameName={gameName} />
                        )}
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default Layout;
