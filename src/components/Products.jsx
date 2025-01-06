import { useReducer, useEffect, useState } from "react";
import { api } from "../services/config";
import styles from "./Product.module.css";
import { BsFilterCircle } from "react-icons/bs";

import { Link } from "react-router-dom";

import { token } from "../services/config";

import { useNavigate } from "react-router-dom";

import SearchBox from "./SearchBox";

import edit from "../assets/edit.png";
import trash from "../assets/trash.png";
import cancel from "../assets/cancel.png";

const productReducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, products: action.payload };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
      };
    case "ADD_PRODUCT":
      return { ...state, products: [...state.products, action.payload] };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

function Products() {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    error: "",
  });

  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // مدال افزودن
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [username, setUsername] = useState("");
  console.log(username);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    quantity: "",
    price: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products?page=1&limit=10");
        console.log(response.data);
        dispatch({
          type: "SET_PRODUCTS",
          payload: response.data.data || response.data,
        });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "خطا در بارگذاری محصولات" });
      }
    };
    fetchProducts();
  }, []);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(`/products/${selectedProduct.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("محصول حذف شد:", response.data);

      dispatch({ type: "REMOVE_PRODUCT", payload: selectedProduct.id });
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("خطا در حذف محصول:", error.response?.data || error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedProduct(null);
  };

  const handleEditClick = (product) => {
    setEditData(product);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      const response = await api.put(`/products/${editData.id}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("محصول ویرایش شد:", response.data);

      dispatch({ type: "UPDATE_PRODUCT", payload: editData });
      setShowEditModal(false);
    } catch (error) {
      console.error(
        "خطا در ویرایش محصول:",
        error.response?.data || error.message
      );
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // بروزرسانی state جستجو
  };

  const filteredProducts = state.products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = async () => {
    try {
      const response = await api.post("/products", newProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("محصول جدید افزوده شد:", response.data);

      dispatch({ type: "ADD_PRODUCT", payload: response.data });
      setShowAddModal(false);
      setNewProduct({ name: "", quantity: "", price: "" }); // Reset form fields
    } catch (error) {
      console.error(
        "خطا در افزودن محصول:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username"); // دریافت username از localStorage
    if (!storedUsername) {
      navigate("/auth/login"); // اگر توکن یا username وجود نداشت، به صفحه لاگین هدایت می‌شود
    } else {
      setUsername(storedUsername); // اگر موجود بود، username را در استیت ذخیره می‌کنیم
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // حذف username از localStorage
    navigate("/auth/login"); // هدایت به صفحه لاگین
  };
  return (
    <>
      <SearchBox
        username={username}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
      />
      <div className={styles.container}>
        <div className={styles.add_product}>
          <div>
            <BsFilterCircle /> <p>مدیریت کالا</p>
          </div>
          <button onClick={() => setShowAddModal(true)}>افزودن محصول</button>
        </div>

        {state.error && <p>{state.error}</p>}

        <div className={styles.table_container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>نام کالا</th>
                <th>موجودی</th>
                <th>قیمت</th>
                <th>شناسه کالا</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>
                      {new Intl.NumberFormat("fa-IR").format(product.quantity)}
                    </td>
                    <td>
                      {new Intl.NumberFormat("fa-IR").format(product.price)}{" "}
                      هزار تومان
                    </td>
                    <td>{product.id}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleEditClick(product)}>
                        <img src={edit} alt="" />
                      </button>
                      <button onClick={() => handleDeleteClick(product)}>
                        <img src={trash} alt="" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">محصولی پیدا نشد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* مدال حذف */}
        {showDeleteModal && (
          <div className={styles.modal}>
            <div className={styles.modal_content}>
              <img src={cancel} alt="" />
              <p>آیا از حذف این محصول اطمینان دارید؟</p>
              <div className={styles.modal_actions}>
                <button onClick={handleConfirmDelete}>حذف</button>
                <button onClick={handleCancelDelete}>لغو</button>
              </div>
            </div>
          </div>
        )}

        {/* مدال ویرایش */}
        {showEditModal && (
          <div className={styles.modal_edit}>
            <div className={styles.modal_edit_content}>
              <h3>ویرایش محصول</h3>
              <label>
                نام کالا:
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                موجودی:
                <input
                  type="number"
                  name="quantity"
                  value={editData.quantity}
                  onChange={handleEditChange}
                />
              </label>
              <label>
                قیمت:
                <input
                  type="number"
                  name="price"
                  value={editData.price}
                  onChange={handleEditChange}
                />
              </label>
              <div className={styles.modal_edit_actions}>
                <button onClick={handleEditSave}>ثبت اطلاعات جدید</button>
                <button onClick={() => setShowEditModal(false)}>انصراف</button>
              </div>
            </div>
          </div>
        )}

        {/* مدال افزودن محصول */}
        {showAddModal && (
          <div className={styles.modal_add}>
            <div className={styles.modal_add_content}>
              <h3>ایجاد محصول جدید</h3>
              <label>
                نام کالا:
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleAddChange}
                />
              </label>
              <label>
                موجودی:
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleAddChange}
                />
              </label>
              <label>
                قیمت:
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleAddChange}
                />
              </label>
              <div className={styles.modal_add_actions}>
                <button onClick={handleAddProduct}>ایجاد</button>
                <button onClick={() => setShowAddModal(false)}>انصراف</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <button className={styles.exit} onClick={handleLogout}>
        خروج
      </button>
    </>
  );
}

export default Products;
