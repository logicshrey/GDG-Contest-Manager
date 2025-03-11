import React from 'react';
import { Box, keyframes } from '@mui/material';
import { styled } from '@mui/material/styles';

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const Dot = styled('div')(({ theme, color }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: color,
  margin: '0 3px',
  animation: `${bounce} 1.5s infinite`,
  '@media (min-width: 600px)': {
    width: '12px',
    height: '12px',
    margin: '0 4px',
  },
}));

const GoogleLogo = () => (
  <Box display="flex" alignItems="center" justifyContent="center" my={2}>
    <Dot color="#4285F4" sx={{ animationDelay: '0s' }} />
    <Dot color="#EA4335" sx={{ animationDelay: '0.2s' }} />
    <Dot color="#FBBC05" sx={{ animationDelay: '0.4s' }} />
    <Dot color="#34A853" sx={{ animationDelay: '0.6s' }} />
  </Box>
);

export default GoogleLogo; 