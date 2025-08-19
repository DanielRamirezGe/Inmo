import { NextResponse } from "next/server";
import apiConfig from "@/config/apiConfig";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return new NextResponse("Image path is required", { status: 400 });
    }

    // Limpiar el path de la imagen eliminando prefijos innecesarios
    let cleanImagePath = imagePath;
    if (cleanImagePath.startsWith("uploads/prototypes/")) {
      cleanImagePath = cleanImagePath.replace("uploads/prototypes/", "");
    } else if (cleanImagePath.startsWith("uploads/")) {
      cleanImagePath = cleanImagePath.replace("uploads/", "");
    }

    // Construir la URL completa del bucket de AWS
    const imageUrl = `https://minkaasa-images.s3.us-east-1.amazonaws.com/${encodeURIComponent(
      cleanImagePath
    )}`;

    console.log("Fetching image from AWS:", imageUrl);

    // Hacer la petición al bucket de AWS
    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch image from AWS: ${response.status} ${response.statusText}`
      );
      return new NextResponse("Image not found", { status: 404 });
    }

    // Obtener el contenido de la imagen
    const imageBuffer = await response.arrayBuffer();

    // Determinar el tipo de contenido
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Retornar la imagen con los headers apropiados
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable", // Cache por 1 año
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error proxying image from AWS:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
