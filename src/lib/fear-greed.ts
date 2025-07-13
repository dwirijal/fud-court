export async function getFearAndGreedIndex() {
  try {
    const response = await fetch('https://api.alternative.me/fng/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data[0]; // Get the latest data point
  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error);
    return null;
  }
}
