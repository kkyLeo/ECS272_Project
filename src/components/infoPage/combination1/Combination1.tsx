import React from 'react';
import Grid from '@mui/material/Grid';
import RatingAndRetirementPieChart from './RatingRetirement';
import RatingDistributionBarChart from './RatingRange';
import { InfoProps } from '../../../types';

const Combination1: React.FC<InfoProps> = ({ gameName }) => {
    return (
        <Grid container spacing={1}>
            {/* Top Part: Rating and Retirement Pie Chart */}
            <Grid item xs={12} style={{ height: '45%', paddingBottom: '5px' }}>
                <RatingAndRetirementPieChart gameName={gameName} />
            </Grid>
    
            {/* Bottom Part: Rating Distribution Bar Chart */}
            <Grid item xs={12} style={{ height: '45%'}}>
                <RatingDistributionBarChart gameName={gameName} />
            </Grid>
        </Grid>
    );
};

export default Combination1;
