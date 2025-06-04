import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const Step2Descriptions = ({ 
  onSubmit, 
  onPrevious, 
  loading, 
  error, 
  initialDescriptions = [],
  showButtons = false,
  buttonText = "Continuar"
}) => {
  const [descriptions, setDescriptions] = useState([]);
  const [newDescription, setNewDescription] = useState({
    title: '',
    description: ''
  });

  // Cargar descripciones iniciales cuando el componente se monta
  useEffect(() => {
    if (initialDescriptions && initialDescriptions.length > 0) {
      setDescriptions([...initialDescriptions]);
    }
  }, [initialDescriptions]);

  const handleAddDescription = () => {
    if (newDescription.title.trim() && newDescription.description.trim()) {
      setDescriptions([...descriptions, { ...newDescription }]);
      setNewDescription({ title: '', description: '' });
    }
  };

  const handleRemoveDescription = (index) => {
    setDescriptions(descriptions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (descriptions.length === 0) {
      alert('Debe agregar al menos una descripción');
      return;
    }
    onSubmit(descriptions);
  };

  return (
    <Box>
      {!showButtons && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Descripciones de la Propiedad
        </Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Lista de descripciones existentes */}
      {descriptions.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Descripciones agregadas ({descriptions.length}):
          </Typography>
          
          {descriptions.map((desc, index) => (
            <Box
              key={desc.descriptionId || index}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                p: 2,
                mb: 2,
                position: 'relative',
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {desc.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'break-word',
                }}
              >
                {desc.description}
              </Typography>
              <IconButton
                onClick={() => handleRemoveDescription(index)}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  color: 'error.main',
                }}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {/* Formulario para nueva descripción */}
      <Box
        sx={{
          border: '1px dashed #ccc',
          borderRadius: 1,
          p: 2,
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Agregar nueva descripción
        </Typography>

        <TextField
          fullWidth
          label="Título"
          value={newDescription.title}
          onChange={(e) =>
            setNewDescription({ ...newDescription, title: e.target.value })
          }
          margin="normal"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Descripción"
          multiline
          rows={4}
          value={newDescription.description}
          onChange={(e) =>
            setNewDescription({ ...newDescription, description: e.target.value })
          }
          margin="normal"
          disabled={loading}
          placeholder="Escribe aquí la descripción completa. El formato del texto se preservará exactamente como lo escribas."
          InputProps={{
            sx: {
              fontFamily: 'monospace',
            },
          }}
        />

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddDescription}
          disabled={loading || !newDescription.title.trim() || !newDescription.description.trim()}
          sx={{ mt: 2 }}
        >
          Agregar descripción
        </Button>
      </Box>

      {/* Botones - solo mostrar si no es modo tabs (showButtons = false) */}
      {!showButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button
              variant="outlined"
              onClick={onPrevious}
              disabled={loading}
            >
              Anterior
            </Button>
            
            <Typography variant="body2" color="text.secondary">
              {descriptions.length === 0 
                ? 'Agregue al menos una descripción para continuar'
                : `${descriptions.length} descripción(es) lista(s) para enviar`
              }
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || descriptions.length === 0}
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            {loading ? 'Guardando...' : buttonText}
          </Button>
        </Box>
      )}

      {/* Botón para modo tabs (showButtons = true) */}
      {showButtons && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || descriptions.length === 0}
            sx={{
              bgcolor: '#25D366',
              '&:hover': { bgcolor: '#128C7E' },
            }}
          >
            {loading ? 'Guardando...' : buttonText}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Step2Descriptions; 