import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogoImage = styled('img')({
  height: '40px',
  width: 'auto',
  '@media (max-width: 600px)': {
    height: '32px',
  },
});

const GDGLogo = () => (
  <Box 
    component="div" 
    sx={{ 
      display: 'flex', 
      alignItems: 'center',
      '& img': {
        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
      }
    }}
  >
    <LogoImage
      src="https://pbs.twimg.com/media/D22N_huX4AEbb1y.jpg"
      alt="GDG Logo"
    />
  </Box>
);

export default GDGLogo; 