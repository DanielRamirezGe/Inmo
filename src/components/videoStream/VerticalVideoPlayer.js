import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  CircularProgress,
  Paper,
  Tooltip,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Fullscreen as FullscreenIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useVideoStream } from '../../hooks/useVideoStream';
import VerticalVideoModal from './VerticalVideoModal';

const VerticalVideoPlayer = ({
  videoPath,
  autoPlay = false,
  showControls = true,
  height = 400,
  onError = null,
  onLoadStart = null,
  onLoadComplete = null,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [buffered, setBuffered] = useState(0);

  const {
    loading: streamLoading,
    error: streamError,
    getStreamUrl,
    setError: setStreamError,
  } = useVideoStream();

  const [streamUrl, setStreamUrl] = useState(null);

  // Obtener URL de streaming cuando cambia videoPath
  useEffect(() => {
    if (videoPath) {
      try {
        const url = getStreamUrl(videoPath);
        if (url) {
          setStreamUrl(url);
          setHasError(false);
          setStreamError(null);
        } else {
          setHasError(true);
        }
      } catch (error) {
        setHasError(true);
        if (onError) onError(error);
      }
    }
  }, [videoPath, getStreamUrl, setStreamError, onError]);

  // Auto-hide controles
  useEffect(() => {
    let timeout;
    if (isPlaying && controlsVisible) {
      timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, controlsVisible]);

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
    
    // Calcular porcentaje de buffer
    const videoElement = videoRef.current;
    if (videoElement.buffered.length > 0) {
      const bufferedEnd = videoElement.buffered.end(videoElement.buffered.length - 1);
      const bufferPercentage = (bufferedEnd / videoElement.duration) * 100;
      setBuffered(bufferPercentage);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    if (onLoadComplete) onLoadComplete();
  }, [onLoadComplete]);

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

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    if (onLoadStart) onLoadStart();
  }, [onLoadStart]);

  const handleError = useCallback((error) => {
    setHasError(true);
    setIsLoading(false);
    if (onError) onError(error);
  }, [onError]);

  const openFullscreenModal = useCallback(() => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
    }
    setShowModal(true);
  }, [isPlaying]);

  const closeFullscreenModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleModalClose = useCallback(() => {
    closeFullscreenModal();
  }, [closeFullscreenModal]);

  const handleModalTimeSync = useCallback((modalCurrentTime, modalIsPlaying) => {
    if (videoRef.current && modalCurrentTime !== undefined) {
      videoRef.current.currentTime = modalCurrentTime;
      setCurrentTime(modalCurrentTime);
      setIsPlaying(false);
    }
  }, []);

  const handleVideoClick = useCallback(() => {
    setControlsVisible(true);
    togglePlayPause();
  }, [togglePlayPause]);

  const handleContainerMouseMove = useCallback(() => {
    setControlsVisible(true);
  }, []);

  const formatTime = (timeInSeconds) => {
    if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Si hay error en el stream
  if (streamError || hasError) {
    return (
      <Paper 
        elevation={2}
        sx={{ 
          height: height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
          aspectRatio: '9/16',
          p: 2
        }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          <AlertTitle>Error al cargar el video</AlertTitle>
          {streamError || 'Error al cargar el video'}
        </Alert>
      </Paper>
    );
  }

  // Si no hay URL de streaming
  if (!streamUrl) {
    return (
      <Paper 
        elevation={2}
        sx={{ 
          height: height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '100%',
          aspectRatio: '9/16',
        }}
      >
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          maxWidth: '100%',
          height: height,
          aspectRatio: '9/16',
          backgroundColor: '#000',
          borderRadius: 2,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onMouseMove={handleContainerMouseMove}
        onClick={handleVideoClick}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          src={streamUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          autoPlay={autoPlay}
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onLoadStart={handleLoadStart}
          onError={handleError}
          playsInline
          preload="metadata"
        />

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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}

        {/* Controls Overlay */}
        {showControls && controlsVisible && !isLoading && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
              p: 2,
              color: 'white',
            }}
          >
            {/* Progress Bar */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <Slider
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={handleSeek}
                size="small"
                sx={{
                  color: 'primary.main',
                  height: 4,
                  '& .MuiSlider-track': {
                    border: 'none',
                    height: 4,
                    opacity: 1,
                    zIndex: 3,
                  },
                  '& .MuiSlider-thumb': {
                    width: 16,
                    height: 16,
                    zIndex: 4,
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    height: 4,
                    opacity: 1,
                    zIndex: 1,
                  },
                }}
              />
              {/* Buffer indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  left: '4px',
                  right: '14px',
                  top: '46%',
                  transform: 'translateY(-50%)',
                  height: '2px',
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
                    borderRadius: '2px',
                  },
                }}
              />
            </Box>

            {/* Controls Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {/* Play/Pause */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayPause();
                }}
                sx={{ color: 'white', p: 0.5 }}
                size="small"
              >
                {isPlaying ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
              </IconButton>

              {/* Time Display */}
              <Typography variant="caption" sx={{ minWidth: 65, fontSize: '0.7rem' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </Typography>

              {/* Spacer */}
              <Box sx={{ flexGrow: 1 }} />

              {/* Volume Control */}
              <Box sx={{ display: 'flex', alignItems: 'center', width: 65 }}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  sx={{ color: 'white', p: 0.25 }}
                  size="small"
                >
                  {isMuted ? <VolumeOffIcon fontSize="small" /> : <VolumeUpIcon fontSize="small" />}
                </IconButton>
                <Slider
                  value={isMuted ? 0 : volume * 100}
                  onChange={handleVolumeChange}
                  size="small"
                  sx={{
                    ml: 0.5,
                    color: 'white',
                    '& .MuiSlider-track': {
                      border: 'none',
                    },
                    '& .MuiSlider-thumb': {
                      width: 10,
                      height: 10,
                    },
                  }}
                />
              </Box>

              {/* Fullscreen Button */}
              <Tooltip title="Pantalla completa">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    openFullscreenModal();
                  }}
                  sx={{ color: 'white', p: 0.5 }}
                  size="small"
                >
                  <FullscreenIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        )}

        {/* Click to Play Overlay */}
        {!isPlaying && !isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '50%',
              p: 2,
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
        )}
      </Box>

      {/* Modal de Pantalla Completa */}
      <VerticalVideoModal
        open={showModal}
        onClose={handleModalClose}
        videoUrl={streamUrl}
        autoPlay={isPlaying}
        onTimeSync={handleModalTimeSync}
        initialTime={currentTime}
      />
    </>
  );
};

export default VerticalVideoPlayer; 