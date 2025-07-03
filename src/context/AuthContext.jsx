
// import { createContext, useState, useCallback, useEffect } from "react";
// import { baseUrl, postRequest, getRequest } from "../utils/services";

// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//     const [user, setUser] = useState(null);
//     const [registerError, setRegisterError] = useState(null);
//     const [isRegisterLoading, setIsRegisterLoading] = useState(false);
//     const [registerInfo, setRegisterInfo] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });

//     const [loginInfo, setLoginInfo] = useState({
//         email: "",
//         password: "",
//     });

//     const [loginError, setLoginError] = useState(null);
//     const [isLoginLoading, setIsLoginLoading] = useState(false);

//     // Load user from localStorage on mount
//     useEffect(() => {
//         try {
//             const storedUser = localStorage.getItem("User");
//             if (storedUser) {
//                 setUser(JSON.parse(storedUser));
//             }
//         } catch (error) {
//             console.error("Error loading user from localStorage:", error);
//         }
//     }, []);

//     // Update Register Info
//     const updateRegisterInfo = useCallback((info) => {
//         setRegisterInfo((prev) => ({ ...prev, ...info }));
//     }, []);

//     // Update Login Info
//     const updateLoginInfo = useCallback((info) => {
//         setLoginInfo((prev) => ({ ...prev, ...info }));
//     }, []);

//     // Register User
//     const registerUser = useCallback(
//         async (registerData) => {
//             setIsRegisterLoading(true);
//             setRegisterError(null);

//             try {
//                 const response = await postRequest(`${baseUrl}/users/register`, registerInfo);

//                 setIsRegisterLoading(false);

//                 if (response.error) {
//                     console.error("Registration failed:", response.message);
//                     return setRegisterError(response.message);
//                 }

//                 localStorage.setItem("User", JSON.stringify(response));
//                 setUser(response);
//             } catch (error) {
//                 console.error("Registration Error:", error);
//                 setRegisterError("Something went wrong. Please try again.");
//                 setIsRegisterLoading(false);
//             }
//         },
//         [registerInfo]
//     );

//     // Login User
//     const loginUser = async (email, password, setUserChats, setPotentialChats) => {
//         console.log("Sending login request:", { email, password });

//         const response = await postRequest(`${baseUrl}/users/login`, { email, password });
//         console.log("Login Response:", response);

//         if (response.error) {
//             console.log("Login Error:", response.error);
//             return { error: true, message: response.message };
//         }
        
//         console.log("Setting User in Context:", response);
//         setUser(response);

//         // Fetch user chats after login
//         if (response._id) {
//             const userChatsResponse = await getRequest(`${baseUrl}/chats/${response._id}`);
//             if (!userChatsResponse.error) {
//                 setUserChats(userChatsResponse); // Set userChats in ChatContext
//             }
            

//             // Fetch all users for potential chats
//             const allUsersResponse = await getRequest(`${baseUrl}/users`);
//             if (!allUsersResponse.error) {
//                 const pChats = allUsersResponse.filter((u) => {
//                     let isChatCreated = false;
//                     if (response._id === u._id) return false; // Exclude the current user
//                     if (userChatsResponse) {
//                         isChatCreated = userChatsResponse.some((chat) => chat.members.includes(u._id));
//                     }
//                     return !isChatCreated;
//                 });
//                 setPotentialChats(pChats); // Set potentialChats in ChatContext
//             }
//         }
//         return response;
//     };

//     // Logout User
//     const logoutUser = useCallback(() => {
//         localStorage.removeItem("User");
//         setUser(null);
//     }, []);

//     useEffect(() => {
//         console.log("AuthContext: User updated:", user);
//     }, [user]);

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 setUser,
//                 registerInfo,
//                 updateRegisterInfo,
//                 registerUser,
//                 registerError,
//                 isRegisterLoading,
//                 logoutUser,
//                 loginUser,
//                 loginError,
//                 loginInfo,
//                 updateLoginInfo,
//                 isLoginLoading,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };


import { createContext, useState, useCallback, useEffect } from "react";
import { baseUrl, postRequest, getRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [registerError, setRegisterError] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: "",
    });

    const [loginError, setLoginError] = useState(null);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    // Load user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("User");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error loading user from localStorage:", error);
        }
    }, []);

    // Update Register Info
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo((prev) => ({ ...prev, ...info }));
    }, []);

    // Update Login Info
    const updateLoginInfo = useCallback((info) => {
        setLoginInfo((prev) => ({ ...prev, ...info }));
    }, []);

    const registerUser = useCallback(async (registerData) => {
      setIsRegisterLoading(true);
      setRegisterError(null);

      try {
          console.log("Attempting to register user:", registerData);

          // Send registration request to backend
          const response = await postRequest(`${baseUrl}/users/register`, registerData);
          console.log("Registration response from postRequest:", response);

          setIsRegisterLoading(false);

          if (response?.token) {
              localStorage.setItem("user", JSON.stringify(response.data));
              setUser(response);
              return response;
          } else {
              console.error("Registration failed: Unexpected response", response);
              return { error: true, message: response?.message || "Registration failed. Please try again." };
          }
      } catch (error) {
          console.error("Registration Error:", error);
          setIsRegisterLoading(false);
          return { error: true, message: "Something went wrong. Please try again." };
      }
  }, []);

  
    const loginUser = async (email, password, setUserChats, setPotentialChats) => {
       
      
        try {
          const response = await postRequest(`${baseUrl}/users/login`, { email, password });
          
      
          if (response.error) {
           
            return { error: true, message: response.message };
          }
      
          // Ensure the token is present in the response
          if (!response.token) {
            console.error("Token not found in login response");
            return { error: true, message: "Token not found in login response" };
          }
      
          // Store the token in local storage
          localStorage.setItem('token', response.token);
      
        //   // Set the user in the context
        //   console.log("Setting User in Context:", response);
        //   setUser(response);
        localStorage.setItem('User', JSON.stringify(response));
        setUser(response);
          // Fetch user chats after login
          if (response._id) {
            const userChatsResponse = await getRequest(`${baseUrl}/chats/${response._id}`);
            if (!userChatsResponse.error) {
              setUserChats(userChatsResponse); // Set userChats in ChatContext
            }
      
            // Fetch all users for potential chats
            const allUsersResponse = await getRequest(`${baseUrl}/users`);
            if (!allUsersResponse.error) {
              const pChats = allUsersResponse.filter((u) => {
                let isChatCreated = false;
                if (response._id === u._id) return false; // Exclude the current user
                if (userChatsResponse) {
                  isChatCreated = userChatsResponse.some((chat) => chat.members.includes(u._id));
                }
                return !isChatCreated;
              });
              setPotentialChats(pChats); // Set potentialChats in ChatContext
            }
          }
      
          return response;
        } catch (error) {
          console.error("Login Error:", error);
          return { error: true, message: "Something went wrong. Please try again." };
        }
      };
    // Logout User
    const logoutUser = useCallback(() => {
        localStorage.removeItem("User");
        setUser(null);
    }, []);

    useEffect(() => {
        console.log("AuthContext: User updated:", user);
    }, [user]);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                registerInfo,
                updateRegisterInfo,
                registerUser,
                registerError,
                isRegisterLoading,
                logoutUser,
                loginUser,
                loginError,
                loginInfo,
                updateLoginInfo,
                isLoginLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};