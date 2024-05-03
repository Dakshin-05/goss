import { Route, Routes } from 'react-router-dom';
import { useSelector } from "react-redux";
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import Header from "./components/Header"
import Welcome from './components/Welcome'

function App() {
  const isLoggedIn = useSelector(state => state.isLoggedIn);
  console.log(isLoggedIn);
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <Routes >
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            {isLoggedIn && <Route path='/user' element={<Welcome />} />}
        </Routes>
      </main>
    </>
  )
}

export default App
