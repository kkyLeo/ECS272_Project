// import React from 'react';
// import Grid from '@mui/material/Grid';
// import PlatformPlaytimeHeatMap from './PlayingTime';
// import PlatformPlayersBarChart from './Players';
// import { InfoProps } from '../../../types';

// const Combination2: React.FC<InfoProps> = ({ gameName }) => {
//     return (
//         <Grid container spacing={2}>
//             {/* Top Part: Platform Playtime Heat Map */}
//             <Grid item xs={12}>
//                 <PlatformPlaytimeHeatMap gameName={gameName} />
//             </Grid>

//             {/* Bottom Part: Platform Players Bar Chart */}
//             <Grid item xs={12}>
//                 <PlatformPlayersBarChart gameName={gameName} />
//             </Grid>
//         </Grid>
//     );
// };

// export default Combination2;
import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import PlatformPlaytimeHeatMap from './PlayingTime';
import PlatformPlayersBarChart from './Players';
import { InfoProps } from '../../../types';

const Combination2: React.FC<InfoProps> = ({ gameName }) => {
    // State to manage selected platforms
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

    return (
        <Grid container spacing={2}>
            {/* Top Part: Platform Playtime Heat Map */}
            <Grid item xs={12}>
                <PlatformPlaytimeHeatMap gameName={gameName} selectedPlatforms={selectedPlatforms} />
            </Grid>

            {/* Bottom Part: Platform Players Bar Chart */}
            <Grid item xs={12}>
                <PlatformPlayersBarChart
                    gameName={gameName}
                    selectedPlatforms={selectedPlatforms}
                    setSelectedPlatforms={setSelectedPlatforms}
                />
            </Grid>
        </Grid>
    );
};

export default Combination2;
