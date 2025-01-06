import axios from "axios";

// آدرس بیس API
export const BASE_URL = "http://localhost:3000";

localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE3MzQ3OTk2NjY1MjMiLCJ1c2VybmFtZSI6ImZhcmJvZCIsImlhdCI6MTczNjE1NDUzNywiZXhwIjoxNzM2MTU4MTM3fQ.82Sob_DaQmmlqGoZxu2KijThNUm3O_2tonh3Y_WJeDw");

// گرفتن توکن
export const token = localStorage.getItem("token");

// استفاده در هدر


// نمونه تنظیم شده Axios
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },

});

// ذخیره توکن


export const getProducts = () =>{
  return api.get("/products?page=1&limit=10");
}
