import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const ConfirmCloseDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  currentStep, 
  prototypeId,
  formType 
}) => {
  const isMinkaasa = formType === 'propertyMinkaasaUnpublished' || 
                    formType === 'propertyMinkaasaPublished';

  const getWarningMessage = () => {
    if (currentStep === 1) {
      return {
        title: '¿Descartar datos ingresados?',
        message: 'Se perderán todos los datos que has ingresado en este formulario.',
        severity: 'warning',
        action: 'Los datos no se han guardado aún.'
      };
    } else if (currentStep === 2) {
      return {
        title: '¿Dejar propiedad incompleta?',
        message: 'Ya se ha creado la información básica de la propiedad, pero falta agregar descripciones e imágenes.',
        severity: 'error',
        action: 'La propiedad quedará incompleta y visible en el sistema sin descripciones ni imágenes.'
      };
    } else if (currentStep === 3) {
      return {
        title: '¿Dejar propiedad sin imágenes?',
        message: 'La propiedad ya tiene información básica y descripciones, pero falta agregar las imágenes.',
        severity: 'error', 
        action: 'La propiedad quedará visible en el sistema pero sin imágenes para mostrar.'
      };
    }
    
    return {
      title: '¿Cerrar formulario?',
      message: 'Se cancelará el proceso actual.',
      severity: 'info',
      action: ''
    };
  };

  const warning = getWarningMessage();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningIcon color="warning" />
        {warning.title}
      </DialogTitle>
      
      <DialogContent>
        <Alert severity={warning.severity} sx={{ mb: 2 }}>
          {warning.message}
        </Alert>
        
        {warning.action && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {warning.action}
          </Typography>
        )}

        {currentStep > 1 && prototypeId && (
          <Box sx={{ 
            bgcolor: 'grey.50', 
            p: 2, 
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Información de la propiedad:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • ID: {prototypeId}<br/>
              • Tipo: {isMinkaasa ? 'Propiedad Minkaasa' : 'Propiedad Normal'}<br/>
              • Paso actual: {currentStep} de 3<br/>
              • Estado: {currentStep === 2 ? 'Sin descripciones e imágenes' : 'Sin imágenes'}
            </Typography>
          </Box>
        )}

        <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
          ¿Estás seguro que quieres cerrar?
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="primary"
        >
          Continuar editando
        </Button>
        
        <Button 
          onClick={onConfirm} 
          variant="contained"
          color="error"
          sx={{ 
            bgcolor: 'error.main',
            '&:hover': { bgcolor: 'error.dark' }
          }}
        >
          {currentStep === 1 ? 'Descartar datos' : 'Dejar incompleta'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmCloseDialog; 