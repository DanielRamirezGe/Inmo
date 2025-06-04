import React from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
} from '@mui/material';

const PropertyCreationStepper = ({ currentStep, formType }) => {
  const steps = [
    {
      label: 'Datos de la Propiedad',
      description: 'Información básica y contacto'
    },
    {
      label: 'Descripciones',
      description: 'Descripciones detalladas'
    },
    {
      label: 'Imágenes',
      description: 'Fotos de la propiedad'
    }
  ];

  const isMinkaasa = formType === 'propertyMinkaasaUnpublished' || 
                    formType === 'propertyMinkaasaPublished';

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        {isMinkaasa ? 'Creando Propiedad Minkaasa' : 'Creando Nueva Propiedad'}
      </Typography>
      
      <Stepper activeStep={currentStep - 1} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Typography variant="body2" fontWeight="medium">
                {step.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {step.description}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default PropertyCreationStepper; 