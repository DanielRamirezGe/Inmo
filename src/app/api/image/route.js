import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("path");

    if (!imagePath) {
      return new NextResponse("Image path is required", { status: 400 });
    }

    // Determinar la URL base del servidor según el entorno
    const isDevelopment = process.env.NODE_ENV === "development";
    const baseURL = isDevelopment
      ? "http://localhost:3010"
      : "https://adonaipayment.com/minkaasa";

    // Construir la URL completa de la imagen
    const imageUrl = `${baseURL}/api/v1/image?path=${encodeURIComponent(
      imagePath
    )}`;

    // Hacer la petición al servidor backend
    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/*",
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
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
    console.error("Error proxying image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
