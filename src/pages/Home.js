import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Fade,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createWorker } from 'tesseract.js';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import GroupsIcon from '@mui/icons-material/Groups';
import ImageIcon from '@mui/icons-material/Image';
import GoogleLogo from '../components/GoogleLogo';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const ColorBar = styled(Box)(({ theme }) => ({
  height: '4px',
  background: `linear-gradient(to right, 
    ${theme.palette.google.blue} 25%, 
    ${theme.palette.google.red} 25%, 
    ${theme.palette.google.red} 50%, 
    ${theme.palette.google.yellow} 50%, 
    ${theme.palette.google.yellow} 75%, 
    ${theme.palette.google.green} 75%)`,
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  borderTopLeftRadius: theme.shape.borderRadius * 2,
  borderTopRightRadius: theme.shape.borderRadius * 2,
}));

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [inputMethod, setInputMethod] = useState(0);
  const [numParticipants, setNumParticipants] = useState('');
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (event, newValue) => {
    setInputMethod(newValue);
    setParticipants([]);
    setError('');
  };

  const handleNumParticipantsSubmit = () => {
    const num = parseInt(numParticipants);
    if (num >= 2) {
      setParticipants(new Array(num).fill(''));
    }
  };

  const handleNameChange = (index, value) => {
    const newParticipants = [...participants];
    newParticipants[index] = value;
    setParticipants(newParticipants);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const worker = await createWorker();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data: { text } } = await worker.recognize(file);
      await worker.terminate();

      const names = text
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);

      if (names.length < 2) {
        setError('Could not detect enough names from the image. Please ensure the names are clearly visible.');
        return;
      }

      setParticipants(names);
    } catch (err) {
      setError('Error processing image. Please try again or use manual input.');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePairs = () => {
    if (participants.length < 2 || participants.some(p => !p.trim())) {
      setError('Please ensure all participant names are filled.');
      return;
    }

    navigate('/pairs', { state: { participants } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <GoogleLogo />
        <Typography 
          variant="h3" 
          component="h1" 
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
            mb: 4
          }}
        >
          Google Developer Groups
        </Typography>

        <StyledPaper elevation={3} sx={{ position: 'relative' }}>
          <ColorBar />
          <Box sx={{ pt: 2 }}>
            <Tabs
              value={inputMethod}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 4,
                '& .MuiTab-root': {
                  minHeight: 64,
                  fontSize: '1rem',
                },
              }}
            >
              <Tab 
                icon={<GroupsIcon />} 
                label="Manual Input" 
                sx={{ 
                  '&.Mui-selected': {
                    color: theme.palette.google.blue,
                  }
                }}
              />
              <Tab 
                icon={<ImageIcon />} 
                label="Image Upload"
                sx={{ 
                  '&.Mui-selected': {
                    color: theme.palette.google.green,
                  }
                }}
              />
            </Tabs>

            <Fade in={true} timeout={800}>
              <Box>
                {inputMethod === 0 && (
                  <Stack spacing={3}>
                    {participants.length === 0 ? (
                      <>
                        <Typography variant="h6">Enter Number of Participants</Typography>
                        <TextField
                          type="number"
                          label="Number of Participants"
                          value={numParticipants}
                          onChange={(e) => setNumParticipants(e.target.value)}
                          inputProps={{ min: "2" }}
                          fullWidth
                          sx={{ maxWidth: 400, mx: 'auto' }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleNumParticipantsSubmit}
                          disabled={parseInt(numParticipants) < 2}
                          sx={{ maxWidth: 200, mx: 'auto' }}
                        >
                          Continue
                        </Button>
                      </>
                    ) : (
                      <>
                        <Typography variant="h6">Enter Participant Names</Typography>
                        <Box sx={{ maxHeight: '50vh', overflow: 'auto', px: 2 }}>
                          <Stack spacing={2}>
                            {participants.map((participant, index) => (
                              <TextField
                                key={index}
                                label={`Participant ${index + 1}`}
                                value={participant}
                                onChange={(e) => handleNameChange(index, e.target.value)}
                                fullWidth
                                required
                              />
                            ))}
                          </Stack>
                        </Box>
                      </>
                    )}
                  </Stack>
                )}

                {inputMethod === 1 && (
                  <Stack spacing={3} alignItems="center">
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        height: 120,
                        width: '100%',
                        maxWidth: 400,
                        border: '2px dashed',
                        borderColor: 'divider',
                        '&:hover': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <Box textAlign="center">
                        <Typography variant="body1" gutterBottom>
                          Upload Participants List
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Supported formats: PNG, JPG, PDF
                        </Typography>
                      </Box>
                      <VisuallyHiddenInput type="file" onChange={handleImageUpload} accept="image/*,.pdf" />
                    </Button>
                    {loading && <CircularProgress />}
                    {participants.length > 0 && (
                      <Typography>
                        {participants.length} participants detected
                      </Typography>
                    )}
                  </Stack>
                )}

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                {participants.length >= 2 && (
                  <Box sx={{ mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={handleGeneratePairs}
                      fullWidth
                      size="large"
                      sx={{ 
                        maxWidth: 300,
                        mx: 'auto',
                        background: `linear-gradient(45deg, 
                          ${theme.palette.google.blue}, 
                          ${theme.palette.google.green})`,
                        '&:hover': {
                          background: `linear-gradient(45deg, 
                            ${theme.palette.google.green}, 
                            ${theme.palette.google.blue})`,
                        }
                      }}
                    >
                      Generate Pairs
                    </Button>
                  </Box>
                )}
              </Box>
            </Fade>
          </Box>
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default Home; 