const isDevelopment = process.env.NODE_ENV === "development";

const apiConfig = {
  baseURL: isDevelopment
    ? "http://localhost:3010"
    : "https://adonaipayment.com/minkaasa",
};

export default apiConfig;
