import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocalStorage, requestHandler } from "../utils";
import { loginUser, logoutUser, registerUser } from "../api/index.js"
import Loader from "../components/Loader.jsx";



const AuthContext = createContext({
    user: null,
    token: null,
    login: async () => {},
    register: async () => {},
    logout: async () => {},
});

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({
    children
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null);

    const navigate = useNavigate();

    const login = async(data) => {
        await requestHandler(
            async () => await loginUser(data),
            setIsLoading,
            (res) => {
              const { data } = res;
              setUser(data.user);
              setToken(data.accessToken);
              LocalStorage.set("user", data.user);
              LocalStorage.set("token", data.accessToken);
              navigate("/home"); 
            },
            alert
          );
    };

    const register = async (data) => {
        await requestHandler(
            async () => await  registerUser(data),
            setIsLoading,
            () => {
                alert("Account created successfully! Go ahead and login.");
                navigate("/login");
            },
            alert
        );
    };

    const logout = async () => {
        await requestHandler(
            async () => await logoutUser(),
            setIsLoading,
            () => {
              setUser(null);
              setToken(null);
              LocalStorage.clear(); 
              navigate("/login"); 
            },
            alert 
          );
    }

    useEffect(()=>{
        setIsLoading(true);
        const token = LocalStorage.get("token");
        const user = LocalStorage.get("user");
        if(token && user?.id) {
            setUser(user);
            setToken(token);
        }

        setIsLoading(false);
    },[]);

    return (
        <AuthContext.Provider value={{user, login, register, logout, token}}>
            {isLoading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider, useAuth };