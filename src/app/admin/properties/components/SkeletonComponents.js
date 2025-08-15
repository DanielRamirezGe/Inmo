import React from "react";
import { Box, Skeleton, Grid, Card, CardContent } from "@mui/material";

/**
 * ✅ Componentes skeleton reutilizables para estados de carga
 *
 * Estos componentes reemplazan el código hardcodeado de skeleton
 * en PropertyEditTabs y pueden ser reutilizados en otros lugares
 */

// ✅ Skeleton para un campo de formulario individual
export const FieldSkeleton = ({ height = 56, labelWidth = "30%" }) => (
  <Box>
    <Skeleton variant="text" width={labelWidth} height={20} sx={{ mb: 1 }} />
    <Skeleton variant="rectangular" height={height} />
  </Box>
);

// ✅ Skeleton para una sección de formulario con múltiples campos
export const FormSectionSkeleton = ({
  fields = 3,
  sectionTitleWidth = "25%",
  showSectionTitle = true,
}) => (
  <Box>
    {showSectionTitle && (
      <Skeleton
        variant="text"
        width={sectionTitleWidth}
        height={32}
        sx={{ mt: 2, mb: 2 }}
      />
    )}
    <Grid container spacing={2}>
      {Array.from({ length: fields }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <FieldSkeleton />
        </Grid>
      ))}
    </Grid>
  </Box>
);

// ✅ Skeleton para formulario básico completo
export const BasicFormSkeleton = ({ sections = 3, fieldsPerSection = 3 }) => (
  <Box>
    {Array.from({ length: sections }).map((_, index) => (
      <FormSectionSkeleton key={index} fields={fieldsPerSection} />
    ))}
    <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
      <Skeleton variant="rectangular" width={200} height={36} />
    </Box>
  </Box>
);

// ✅ Skeleton para tarjetas de descripción
export const DescriptionCardSkeleton = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
      <Skeleton variant="text" width="100%" height={60} />
    </CardContent>
  </Card>
);

// ✅ Skeleton para sección de descripciones
export const DescriptionsSkeleton = ({ existingDescriptions = 1 }) => (
  <Box>
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Box sx={{ mb: 2 }}>
      <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
      {Array.from({ length: existingDescriptions }).map((_, index) => (
        <DescriptionCardSkeleton key={index} />
      ))}
    </Box>

    {/* Área de nueva descripción */}
    <Box sx={{ border: "1px dashed #ccc", borderRadius: 1, p: 2 }}>
      <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width={150} height={36} />
    </Box>
  </Box>
);

// ✅ Skeleton para galería de imágenes
export const ImageGallerySkeleton = ({
  mainImageCount = 1,
  secondaryImageCount = 2,
}) => (
  <Box sx={{ mb: 3 }}>
    <Skeleton variant="text" width="30%" height={24} sx={{ mb: 2 }} />
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      {/* Imagen principal */}
      {mainImageCount > 0 && (
        <Skeleton variant="rectangular" width={200} height={150} />
      )}
      {/* Imágenes secundarias */}
      {Array.from({ length: secondaryImageCount }).map((_, index) => (
        <Skeleton key={index} variant="rectangular" width={150} height={150} />
      ))}
    </Box>
  </Box>
);

// ✅ Skeleton para controles de carga de archivos
export const FileUploadControlsSkeleton = ({ controlsCount = 2 }) => (
  <Grid container spacing={2} sx={{ mb: 3 }}>
    {Array.from({ length: controlsCount }).map((_, index) => (
      <Grid item xs={12} md={6} key={index}>
        <Skeleton variant="rectangular" height={200} />
      </Grid>
    ))}
  </Grid>
);

// ✅ Skeleton completo para sección de imágenes
export const ImagesSkeleton = ({
  showGallery = true,
  existingImagesCount = 2,
}) => (
  <Box>
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />

    {/* Galería de imágenes existentes */}
    {showGallery && (
      <ImageGallerySkeleton
        mainImageCount={1}
        secondaryImageCount={existingImagesCount}
      />
    )}

    {/* Controles de carga */}
    <FileUploadControlsSkeleton controlsCount={2} />
  </Box>
);

// ✅ Skeleton para sección de video
export const VideoSkeleton = ({ showVideoPlayer = false }) => (
  <Box>
    <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
    <Skeleton variant="text" width="70%" height={20} sx={{ mb: 3 }} />

    {/* Player de video existente */}
    {showVideoPlayer && (
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </Box>
    )}

    {/* Controles de carga */}
    <FileUploadControlsSkeleton controlsCount={2} />
  </Box>
);

// ✅ Skeleton para tabs completos
export const TabContentSkeleton = ({ type = "basic", ...props }) => {
  switch (type) {
    case "basic":
      return <BasicFormSkeleton {...props} />;
    case "descriptions":
      return <DescriptionsSkeleton {...props} />;
    case "images":
      return <ImagesSkeleton {...props} />;
    case "video":
      return <VideoSkeleton {...props} />;
    default:
      return <BasicFormSkeleton {...props} />;
  }
};

// ✅ Skeleton con animación personalizada
export const AnimatedSkeleton = ({ children, delay = 0, stagger = 100 }) => (
  <Box
    sx={{
      animationDelay: `${delay}ms`,
      "& .MuiSkeleton-root": {
        animationDelay: `${delay}ms`,
        animationDuration: "1.2s",
      },
      "& > *:nth-of-type(n)": {
        animationDelay: `${delay + stagger}ms`,
      },
    }}
  >
    {children}
  </Box>
);

// ✅ Skeleton con fade-in gradual para mejor UX
export const GradualLoadingSkeleton = ({
  type,
  itemCount = 3,
  staggerDelay = 150,
  ...props
}) => (
  <Box>
    {Array.from({ length: itemCount }).map((_, index) => (
      <AnimatedSkeleton key={index} delay={index * staggerDelay}>
        <TabContentSkeleton type={type} {...props} />
      </AnimatedSkeleton>
    ))}
  </Box>
);
