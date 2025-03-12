import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Fade,
  useTheme,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ReplayIcon from '@mui/icons-material/Replay';
import GoogleLogo from '../components/GoogleLogo';

const shuffle = keyframes`
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
  25% { transform: translate(100px, -50px) rotate(45deg); opacity: 0.3; }
  50% { transform: translate(-100px, 50px) rotate(-45deg); opacity: 0.3; }
  75% { transform: translate(50px, 100px) rotate(25deg); opacity: 0.3; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const StyledCard = styled(Card)(({ theme, delay = 0 }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  position: 'relative',
  overflow: 'visible',
  animation: `${float} 3s ease-in-out infinite`,
  animationDelay: `${delay * 0.1}s`,
  '&:hover': {
    transform: 'scale(1.05) translateY(-5px)',
    '&::after': {
      opacity: 1,
    },
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    borderRadius: 'inherit',
    opacity: 0,
    transition: 'opacity 0.3s ease-in-out',
    zIndex: -1,
  },
  padding: theme.spacing(1),
  minHeight: '120px',
  maxWidth: '200px',
  margin: 'auto',
}));

const ShufflingCard = styled(Box)(({ theme, delay = 0 }) => ({
  position: 'absolute',
  width: '60px',
  height: '80px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  animation: `${shuffle} 1.5s ease-in-out infinite`,
  animationDelay: `${delay * 0.2}s`,
  boxShadow: theme.shadows[4],
}));

const ColorBar = styled(Box)(({ theme, color }) => ({
  height: '4px',
  backgroundColor: color,
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius,
}));

const PairsDisplay = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [pairs, setPairs] = useState([]);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showPairs, setShowPairs] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const participants = location.state?.participants || [];
    if (participants.length === 0) {
      navigate('/');
      return;
    }

    // Show shuffling animation for 2 seconds
    setTimeout(() => {
      setShowAnimation(false);
      generatePairs(participants);
      setTimeout(() => setShowPairs(true), 300);
    }, 2000);
  }, [location.state, navigate]);

  const generatePairs = (participants) => {
    let shuffled = [...participants];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const newPairs = [];
    for (let i = 0; i < shuffled.length - 1; i += 2) {
      newPairs.push([shuffled[i], shuffled[i + 1]]);
    }

    if (shuffled.length % 2 !== 0) {
      newPairs.push([shuffled[shuffled.length - 1], '(Bye)']);
    }

    setPairs(newPairs);
  };

  const downloadAsPNG = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: theme.palette.background.default,
    });
    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = data;
    link.download = 'gdg-coding-pairs.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAsPDF = async () => {
    const element = contentRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: theme.palette.background.default,
    });
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('gdg-coding-pairs.pdf');
  };

  const regeneratePairs = () => {
    const participants = pairs.flat().filter(p => p !== '(Bye)');
    generatePairs(participants);
  };

  const googleColors = [
    theme.palette.google.blue,
    theme.palette.google.red,
    theme.palette.google.yellow,
    theme.palette.google.green,
  ];

  return (
    <Container maxWidth="lg">
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          gap: 2,
          background: 'rgba(255,255,255,0.9)'
        }}
        open={showAnimation}
      >
        <Box sx={{ position: 'relative', width: 200, height: 200 }}>
          {[...Array(8)].map((_, i) => (
            <ShufflingCard 
              key={i} 
              delay={i}
              sx={{
                backgroundColor: googleColors[i % googleColors.length],
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </Box>
        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
          Generating Pairs...
        </Typography>
      </Backdrop>

      <Fade in={!showAnimation} timeout={500}>
        <Box sx={{ my: 4 }} ref={contentRef}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              background: 'white',
              borderRadius: 4,
              mb: 4,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(to right, 
                  ${theme.palette.google.blue} 25%, 
                  ${theme.palette.google.red} 25%, 
                  ${theme.palette.google.red} 50%, 
                  ${theme.palette.google.yellow} 50%, 
                  ${theme.palette.google.yellow} 75%, 
                  ${theme.palette.google.green} 75%)`,
              }}
            />
            <GoogleLogo />
            <Typography 
              variant="h3" 
              align="center" 
              gutterBottom 
              sx={{ 
                fontWeight: 500,
                background: `linear-gradient(45deg, 
                  ${theme.palette.google.blue}, 
                  ${theme.palette.google.red}, 
                  ${theme.palette.google.yellow}, 
                  ${theme.palette.google.green})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Coding Contest Pairs
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
              Google Developer Groups
            </Typography>
          </Paper>

          <Grid container spacing={1} justifyContent="center">
            {pairs.map((pair, index) => (
              <Fade 
                in={showPairs} 
                timeout={500 + index * 100} 
                key={index}
              >
                <Grid item xs={6} sm={4} md={3} lg={2}>
                  <StyledCard delay={index}>
                    <ColorBar color={googleColors[index % googleColors.length]} />
                    <CardContent sx={{ p: 1 }}>
                      <Typography 
                        variant="subtitle2" 
                        color={googleColors[index % googleColors.length]} 
                        gutterBottom
                        sx={{ fontWeight: 500 }}
                      >
                        Match {index + 1}
                      </Typography>
                      <Stack spacing={0.5}>
                        <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {pair[0]}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          align="center"
                          sx={{ fontWeight: 500 }}
                        >
                          vs
                        </Typography>
                        <Box sx={{ p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {pair[1]}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </StyledCard>
                </Grid>
              </Fade>
            ))}
          </Grid>
        </Box>
      </Fade>

      <SpeedDial
        ariaLabel="Download options"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          icon={<ImageIcon />}
          tooltipTitle="Download PNG"
          onClick={downloadAsPNG}
        />
        <SpeedDialAction
          icon={<PictureAsPdfIcon />}
          tooltipTitle="Download PDF"
          onClick={downloadAsPDF}
        />
        <SpeedDialAction
          icon={<ReplayIcon />}
          tooltipTitle="Regenerate Pairs"
          onClick={regeneratePairs}
        />
      </SpeedDial>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          size="large"
          sx={{
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Start Over
        </Button>
      </Box>
    </Container>
  );
};

export default PairsDisplay; 