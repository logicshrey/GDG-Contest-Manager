import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import GDGLogo from './GDGLogo';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}));

const Header = () => {
  return (
    <StyledAppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box display="flex" alignItems="center" gap={2}>
            <GDGLogo />
            <Box>
              <Typography 
                variant="h6" 
                color="google.blue"
                sx={{ 
                  fontWeight: 500,
                  letterSpacing: '-0.5px',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Google Developer Groups
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                On Campus Pillai College of Engineering
              </Typography>
            </Box>
            <Typography 
              variant="h6" 
              color="google.blue"
              sx={{ 
                display: { xs: 'block', sm: 'none' },
                fontSize: '1rem'
              }}
            >
              GDG Pairs
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 