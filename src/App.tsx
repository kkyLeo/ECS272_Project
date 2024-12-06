import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PartOne from './components/overview/PartOne';
import Layout from './components/infoPage/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { grey } from '@mui/material/colors';
import './styles/App.css';
import ListView from './components/overview/ListView';
import Dashboard from './components/overview/Overview';
import PartOne_ from './components/overview/PartOne_';

// Adjust the color theme for material ui
const theme = createTheme({
  palette: {
    primary: {
      main: grey[700],
    },
    secondary: {
      main: grey[700],
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<ListView/>} />
            <Route path="/game-info/:gameName" element={<Layout />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
