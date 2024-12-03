import React from 'react';
import Grid from '@mui/material/Grid';
import PlatformPlaytimeHeatMap from './PlaytingTime';
import PlatformPlayersBarChart from './Players';
import { InfoProps } from '../../../types';

const Combination2: React.FC<InfoProps> = ({ gameName }) => {
    return (
        <Grid container spacing={2}>
            {/* Top Part: Platform Playtime Heat Map */}
            <Grid item xs={12}>
                <PlatformPlaytimeHeatMap gameName={gameName} />
            </Grid>

            {/* Bottom Part: Platform Players Bar Chart */}
            <Grid item xs={12}>
                <PlatformPlayersBarChart gameName={gameName} />
            </Grid>
        </Grid>
    );
};

export default Combination2;
