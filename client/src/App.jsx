import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
import ChatPage from "./pages/chat";
import HomePage from "./pages/home";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

const App = () => {
  const {token, user} = useAuth();
console.log(token, user)
  return (
    <Routes>
      <Route 
        path='/'
        element={
          token && user?.id ? (
            <Navigate to="/home" />
          ): (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path='/chat'
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      <Route
        path='/home'
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path='/login'
        element={
          <PublicRoute>
            <Login/>
          </PublicRoute>
        }
        />
        <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route path='*' element={<p>404 Not found</p>}/>
      </Routes>
  )
}
export default App
