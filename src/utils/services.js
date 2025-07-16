
export const baseUrl = "https://find-your-perfect-home-backend.onrender.com/api";

export const getRequest = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    let message = "An error occurred.";

    if (data?.message) {
      message = data.message;
    }

    return { error: true, message };
  }
  return data;
};

export const postRequest = async (url, body) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      let message = data?.message || "An error occurred.";
      return { error: true, message };
    }

    return data;
  } catch (error) {
    console.error("Request Error:", error);
    return { error: true, message: "Network error. Please try again." };
  }
};