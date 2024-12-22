import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { useState } from "react";
import axios from "axios";
import img from "../assets/f.png";
import { api } from "../services/config";

function SignUp({ toggleForm }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false); // state برای لودر

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("رمز عبور با تکرار آن تطابق ندارد.");
      return;
    }
    setLoading(true); // فعال کردن لودر
    try {
      const response = await api.post("/auth/register", {
        username,
        password,
      });

      setSuccessMessage("ثبت‌نام با موفقیت انجام شد!");
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 2000);
    } catch (error) {
      setErrorMessage("خطا در ثبت‌نام. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false); // غیرفعال کردن لودر
    }
  };

  return (
    <><div className={styles.body}>
      <div className={styles.container}>
        <div className={styles.img}>
          <img src={img} alt="f logo" />
        </div>
        <h2>فرم ثبت نام</h2>
        <form className={styles.form_container} onSubmit={handleSignUp}>
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
          <input
            type="password"
            placeholder="تکرار رمز عبور"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" disabled={loading}>ثبت نام</button>
          {loading && <div className={styles.loader}>در حال بارگذاری...</div>} {/* نمایش لودر */}
          {errorMessage && <p className={styles.err}>{errorMessage}</p>}
          {successMessage && <p className={styles.success}>{successMessage}</p>}
          <a href="#" onClick={toggleForm}>
            حساب کاربری دارید؟
          </a>
        </form>
      </div>
      </div>
    </>
  );
}

export default SignUp;
