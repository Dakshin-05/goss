import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import SignUp from "./pages/signUp";
// import ChatPage from "./pages/chat";
// import ChatPage from "./pages/tmpchat";
import HomePage from "./pages/home";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Error from "./components/Error";
import { LayOut2 } from "./components/Layout2";
import TmpChat from "./components/tmpchat";
import ProfileCard from "./components/Profile";
import ServerSide from "./components/ServerSide";
import Render from "./components/Render";
import ServerPage from "./components/ServerPage";
import Roles from "./components/Roles";
import FriendInfo from "./components/FriendInfo";

const App = () => {
  const {token, user} = useAuth();

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
        path='/chat/:friendId'
        element={
          <PrivateRoute>
            {/* <ChatPage /> */}
            {/* <Error/> */}
            <LayOut2 Component={TmpChat}/>
          </PrivateRoute>
        }
      />
      <Route
        path='/home'
        element={
          <PrivateRoute>
            <HomePage />
            {/* <div className="flex justify-center items-center min-h-screen bg-gray-900"> */}
              {/* <ProfileCard /> */}
              {/* <ServerSide /> */}
              {/* <FriendInfo /> */}
              {/* <Render/> */}
              {/* <ServerPage/> */}
              {/* <Roles/> */}
            {/* </div> */}
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
