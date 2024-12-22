import { Navigate, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import SignUp from "./pages/SignUp"
import ProductList from "./pages/ProductList"

function App() {

  return (
    <>
      <Routes>
        <Route index element={<Navigate to="/auth/login" replace />}/>
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/sign-up" element={<SignUp />} />
        <Route path="/dashboard" element={<ProductList />} />
      </Routes>
    </>
  )
}

export default App
