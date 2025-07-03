// export const baseUrl="http://localhost:5001/api";


// export const getRequest=async(url)=>{
    
//     const response=await fetch(url);

//     const data= await response.json();

//     if(!response.ok){
//         let message="An error Occurred..";

//         if(data?.message){
//             message=data.message;
//         }

//         return {error:true,message};
//     }
//     return data;
// };


// // export const postRequest = async (url, body) => {
// //     try {
// //       const response = await fetch(url, {
// //         method: 'POST',
// //         headers: {
// //           "Content-Type": "application/json",
// //           "Authorization": `Bearer ${localStorage.getItem('token')}`
// //         },
// //         body: JSON.stringify(body),
// //       });
  
// //       console.log("Response Status:", response.status);
  
// //       // Ensure response is JSON before parsing
// //       const text = await response.text();
// //       try {
// //         var data = JSON.parse(text);
// //       } catch (error) {
// //         console.error("Failed to parse response as JSON:", text);
// //         throw new Error("Invalid response from server. Expected JSON.");
// //       }
  
// //       console.log("Response Data:", data);
  
// //       if (!response.ok) {
// //         let message = data?.message || "An error occurred.";
// //         return { error: true, message };
// //       }
  
// //       return data;
// //     } catch (error) {
// //       console.error("Request Error:", error);
// //       return { error: true, message: "Network error. Please try again." };
// //     }
// //   };

// export const postRequest = async (url, body) => {
//   try {
//     console.log("Making POST request to:", url); // Debugging: Log the URL
//     console.log("Request body:", body); // Debugging: Log the request body

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(body),
//     });

//     console.log("Response status:", response.status); // Debugging: Log the response status

//     const text = await response.text(); // Get the response as text
//     console.log("Response text:", text); // Debugging: Log the raw response text

//     let data;
//     try {
//       data = JSON.parse(text); // Try to parse it as JSON
//     } catch (error) {
//       console.error("Failed to parse response as JSON:", text);
//       return { error: true, message: "Invalid response from server. Expected JSON." };
//     }

//     console.log("Response data:", data); // Debugging: Log the parsed response data

//     if (!response.ok) {
//       let message = data?.message || "An error occurred.";
//       return { error: true, message };
//     }

//     return data;
//   } catch (error) {
//     console.error("Request Error:", error);
//     return { error: true, message: "Network error. Please try again." };
//   }
// };


export const baseUrl = "http://localhost:5001/api";

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