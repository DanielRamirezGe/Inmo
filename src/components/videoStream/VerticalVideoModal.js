import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  Box,
  IconButton,
  Slider,
  Typography,
  CircularProgress,
  Fade,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Close as CloseIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';

const VerticalVideoModal = ({
  open,
  onClose,
  videoUrl,
  autoPlay = false,
  onTimeSync = null,
  initialTime = 0,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [buffered, setBuffered] = useState(0);

  // Funciones utilitarias locales
  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateBufferPercentage = (videoElement) => {
    if (!videoElement || !videoElement.buffered || !videoElement.duration) {
      return 0;
    }
    
    const bufferedRanges = videoElement.buffered;
    if (bufferedRanges.length === 0) return 0;
    
    const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1);
    return (bufferedEnd / videoElement.duration) * 100;
  };

  // Auto-hide controles
  useEffect(() => {
    let timeout;
    if (isPlaying && controlsVisible && open) {
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000); // 3 segundos
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, controlsVisible, open]);

  // Reset estados cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      setControlsVisible(true);
      setIsLoading(true);
      if (autoPlay && videoRef.current) {
        videoRef.current.play();
      }
      // Establecer el tiempo inicial del video principal
      if (initialTime > 0 && videoRef.current) {
        videoRef.current.currentTime = initialTime;
        setCurrentTime(initialTime);
      }
    } else {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setIsLoading(true);
    }
  }, [open, autoPlay, initialTime]);

  // Funciones de control del video
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    
    // Usar utilidad centralizada para calcular buffer
    const bufferPercentage = calculateBufferPercentage(videoRef.current);
    setBuffered(bufferPercentage);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    
    // Establecer el tiempo inicial después de cargar metadatos
    if (initialTime > 0) {
      videoRef.current.currentTime = initialTime;
      setCurrentTime(initialTime);
    }
  }, [initialTime]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleVolumeChange = useCallback((event, newValue) => {
    if (!videoRef.current) return;
    const volumeValue = newValue / 100;
    setVolume(volumeValue);
    videoRef.current.volume = volumeValue;
    setIsMuted(volumeValue === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleSeek = useCallback((event, newValue) => {
    if (!videoRef.current) return;
    const seekTime = (newValue / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  }, [duration]);

  const handleVideoClick = useCallback(() => {
    setControlsVisible(true);
    togglePlayPause();
  }, [togglePlayPause]);

  const handleContainerMouseMove = useCallback(() => {
    setControlsVisible(true);
  }, []);

  const handleClose = useCallback(() => {
    // Sincronizar tiempo con el reproductor principal antes de cerrar
    if (onTimeSync && videoRef.current) {
      onTimeSync(videoRef.current.currentTime, isPlaying);
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onClose();
  }, [onClose, onTimeSync, isPlaying]);

  // Manejar teclas de acceso rápido usando configuración centralizada
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!open) return;

      switch (event.key) {
        case ' ':
        case 'k':
          event.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.max(0, currentTime - 10);
          }
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime = Math.min(duration, currentTime + 10);
          }
          break;
        case 'm':
          event.preventDefault();
          toggleMute();
          break;
        case 'Escape':
          event.preventDefault();
          handleClose();
          break;
        default:
          break;
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [open, togglePlayPause, currentTime, duration, toggleMute, handleClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullScreen
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#000',
          margin: 0,
          borderRadius: 0,
        },
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          cursor: controlsVisible ? 'default' : 'none',
        }}
        onMouseMove={handleContainerMouseMove}
        onClick={handleVideoClick}
      >
        {/* Video Element - Usando configuración centralizada */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
            autoPlay={autoPlay}
            onPlay={handlePlay}
            onPause={handlePause}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onLoadStart={() => setIsLoading(true)}
            playsInline
            preload="metadata"
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10,
            }}
          >
            <CircularProgress color="primary" size={60} />
          </Box>
        )}

        {/* Close Button */}
        <Fade in={controlsVisible}>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              zIndex: 20,
            }}
          >
            <CloseIcon />
          </IconButton>
        </Fade>

        {/* Controls Overlay */}
        <Fade in={controlsVisible && !isLoading}>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
              p: 3,
              color: 'white',
              zIndex: 20,
            }}
          >
            {/* Progress Bar */}
            <Box sx={{ mb: 3, position: 'relative' }}>
              <Slider
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                size="medium"
                sx={{
                  color: 'primary.main',
                  height: 6,
                  '& .MuiSlider-track': {
                    border: 'none',
                    height: 6,
                    opacity: 1,
                    zIndex: 3,
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: 6,
                    opacity: 1,
                    zIndex: 1,
                  },
                  '& .MuiSlider-thumb': {
                    width: 20,
                    height: 20,
                    zIndex: 4,
                    '&:hover': {
                      boxShadow: '0px 0px 0px 8px rgba(25, 118, 210, 0.16)',
                    },
                  },
                }}
              />
              {/* Buffer indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '4px',
                  right: '14px',
                  top: '45%',
                  transform: 'translateY(-50%)',
                  height: '4px',
                  pointerEvents: 'none',
                  zIndex: 2,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: `${buffered}%`,
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: '3px',
                  },
                }}
              />
            </Box>

            {/* Controls Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Play/Pause */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}
              </IconButton>

              {/* Time Display - usar formatTime centralizado */}
              <Typography variant="h6" sx={{ minWidth: 140, fontFamily: 'monospace' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Volume Control */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 120 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  sx={{ 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    mr: 1,
                  }}
                >
                  {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  size="medium"
                  sx={{
                    color: 'white',
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16,
                    },
                  }}
                />
              </Box>

              {/* Exit Fullscreen */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                sx={{ 
                  color: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <FullscreenExitIcon />
              </IconButton>
            </Box>
          </Box>
        </Fade>

        {/* Click to Play Overlay */}
        <Fade in={!isPlaying && !isLoading}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              p: 3,
              zIndex: 15,
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 80, color: 'white' }} />
          </Box>
        </Fade>
      </Box>
    </Dialog>
  );
};

export default VerticalVideoModal; 