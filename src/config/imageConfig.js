// Configuración para URLs de imágenes
export const AWS_IMAGE_CONFIG = {
  // URL base del bucket de AWS
  AWS_BASE_URL: "https://minkaasa-images.s3.us-east-1.amazonaws.com",

  // Función para obtener la URL completa de una imagen
  getImageUrl: (imagePath) => {
    if (!imagePath) return "";

    // Si ya es una URL completa, retornarla tal como está
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }

    // Si es un blob URL, retornarlo tal como está
    if (imagePath.startsWith("blob:")) {
      return imagePath;
    }

    // Eliminar el prefijo "uploads/prototypes/" si existe
    let cleanPath = imagePath;
    if (cleanPath.startsWith("uploads/prototypes/")) {
      cleanPath = cleanPath.replace("uploads/prototypes/", "");
    } else if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.replace("uploads/", "");
    }

    // Construir la URL completa del bucket de AWS
    return `${AWS_IMAGE_CONFIG.AWS_BASE_URL}/${cleanPath}`;
  },

  // Función para limpiar el path de una imagen (eliminar prefijos innecesarios)
  cleanImagePath: (imagePath) => {
    if (!imagePath) return "";

    let cleanPath = imagePath;
    if (cleanPath.startsWith("uploads/prototypes/")) {
      cleanPath = cleanPath.replace("uploads/prototypes/", "");
    } else if (cleanPath.startsWith("uploads/")) {
      cleanPath = cleanPath.replace("uploads/", "");
    }

    return cleanPath;
  },
};
