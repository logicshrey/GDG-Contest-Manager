import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from './theme';
import Header from './components/Header';
import Home from './pages/Home';
import PairsDisplay from './pages/PairsDisplay';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pairs" element={<PairsDisplay />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 