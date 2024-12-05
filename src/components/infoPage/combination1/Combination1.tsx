import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import RatingAndRetirementPieChart from './RatingRetirement';
import RatingDistributionBarChart from './RatingRange';
import PlatformRatingBarChart from './PlatformRatingRange';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { InfoProps } from '../../../types';

const Combination1: React.FC<InfoProps> = ({ gameName }) => {
    const [activeChart, setActiveChart] = useState<'rating' | 'platform'>('rating');

    return (
        <Grid container spacing={1}>
            {/* Top Part: Rating and Retirement Pie Chart */}
            <Grid item xs={12} style={{ height: '33%', paddingBottom: '2px' }}>
                <RatingAndRetirementPieChart gameName={gameName} />
            </Grid>

            {/* Legend with Toggle Buttons */}
            <Grid item xs={12} style={{ textAlign: 'center', marginBottom: '10px' }}>
                <ButtonGroup variant="contained" color="primary">
                    <Button
                        onClick={() => setActiveChart('rating')}
                        disabled={activeChart === 'rating'}
                    >
                        Rating Distribution
                    </Button>
                    <Button
                        onClick={() => setActiveChart('platform')}
                        disabled={activeChart === 'platform'}
                    >
                        Platform Rating Distribution
                    </Button>
                </ButtonGroup>
            </Grid>

            {/* Bottom Part: Conditional Bar Chart */}
            <Grid item xs={12} style={{ height: '33%' }}>
                {activeChart === 'rating' ? (
                    <RatingDistributionBarChart gameName={gameName} />
                ) : (
                    <PlatformRatingBarChart gameName={gameName} />
                )}
            </Grid>
        </Grid>
    );
};

export default Combination1;
