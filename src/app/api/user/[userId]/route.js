import { NextResponse } from "next/server";
import axios from "axios";
import apiConfig from "../../../../config/apiConfig";

export async function PATCH(request, { params }) {
  try {
    const { userId } = params;
    const body = await request.json();
    const token = request.headers.get("authorization");

    const response = await axios.patch(
      `${apiConfig.baseURL}/api/v1/user/${userId}`,
      body,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error in proxy:", error.response?.data || error.message);
    return NextResponse.json(
      error.response?.data || { message: "Internal server error" },
      { status: error.response?.status || 500 }
    );
  }
}
