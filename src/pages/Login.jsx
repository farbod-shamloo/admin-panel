import styles from "./Login.module.css";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import SignUp from "./SignUp";
import img from "../assets/f.png";
import { api } from "../services/config";
import { useNavigate, Link} from "react-router-dom";  // اضافه کردن useNavigate

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();  // استفاده از useNavigate برای هدایت به صفحات مختلف

  // چک کردن اینکه آیا کاربر قبلاً وارد شده است
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // هدایت به صفحه داشبورد اگر توکن وجود داشت
    }
  }, [navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setSearchParams({ form: isLogin ? "sign-up" : "login" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("لطفا فیلد هارو پر کنید");
      return;
    }
    try {
      const response = await api.post("auth/login", { username, password });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username); // ذخیره کردن username
  
      window.location.href = "/dashboard";
    } catch (error) {
      setErrorMessage("نام کاربری یا رمز عبور اشتباه است.");
    }
  };
  
  return (
    <> 
      {isLogin ? (
        <div className={styles.body}>
          <div className={styles.container}>
            <div className={styles.img}>
              <img src={img} alt="f logo" />
            </div>
            <h2>فرم ورود</h2>
            <form className={styles.form_container} onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="نام کاربری"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="password"
                placeholder="رمز عبور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">ورود</button>
              {errorMessage && <p className={styles.err}>{errorMessage}</p>}
              <a href="#" onClick={toggleForm}>
                ایجاد حساب کاربری !
              </a>
            </form>
          </div>
        </div>
      ) : (
        <SignUp toggleForm={toggleForm} />
      )}

    
    </>
  );
}

export default Login;
