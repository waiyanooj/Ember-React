import React, { useEffect, useRef, useState } from "react";
import "../Styles/Menu.css";
import { Link } from "react-router-dom";
import menuData from "./MenuData/Data";
import axios from "axios";

const Menu = () => {
  ///////////////////////////
  //  Save to LocalStorage for cart
  //////////////////////////
  const [cart, setCart] = useState(() => {
    const saveCart = localStorage.getItem("cart");

    return saveCart ? JSON.parse(saveCart) : [];
  });

  const [Toast, setToast] = useState(false);

  const ToastTimer = useRef(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handelSave = (e) => {
    const productName = e.currentTarget.dataset.product;
    const money = Number(e.currentTarget.dataset.price);

    setCart((prevCart) => {
      const exitingItem = prevCart.find((item) => item.name === productName);

      if (exitingItem) {
        return prevCart.map((item) =>
          item.name === productName
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...prevCart,
        {
          name: productName,
          price: money,
          quantity: 1,
        },
      ];
    });

    setToast(true);

    clearTimeout(ToastTimer.current);

    ToastTimer.current = setTimeout(() => {
      setToast(false);
    }, 2400);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const getProductQuantity = (productName) => {
    const item = cart.find((item) => item.name === productName);

    return item ? item.quantity : 0;
  };

  const [Filter, setFilter] = useState("all");
  const [Rating, setRating] = useState(false);
  const [selectRating, setSelectRating] = useState(0);

  const [saveRating, setSaveRating] = useState(() => {
    const savingRating = localStorage.getItem("saveRating");

    return savingRating ? JSON.parse(savingRating) : [];
  });

  useEffect(() => {
    localStorage.setItem("saveRating", JSON.stringify(saveRating));
  }, [saveRating]);

  const handelRating = (e) => {
    const rating = Number(e.currentTarget.dataset.rating);

    setSelectRating(rating);

    setSaveRating((prevRating) => {
      const RatingItem = prevRating.find(
        (item) => item.name === selectedProduct,
      );

      if (RatingItem) {
        return prevRating.map((item) =>
          item.name === selectedProduct ? { ...item, rating: rating } : item,
        );
      }

      return [
        ...prevRating,
        {
          name: selectedProduct,
          rating: rating,
        },
      ];
    });
  };

  console.log(saveRating);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [saveToast, setSaveToast] = useState(false);
  const [removeToast, setRemoveToast] = useState(false)
  const saveToastTimer = useRef(null)
  const removeTimer = useRef(null);

  /////////////////////////////////
  // Save Cart for Profile 
  ////////////////////////////////

  const [saveProfile, setSaveProfile] = useState(() => {
    const saveItemProfile = localStorage.getItem("saveProfile");

    return saveItemProfile ? JSON.parse(saveItemProfile) : [];
  });

  useEffect(() => { 
    localStorage.setItem("saveProfile", JSON.stringify(saveProfile));
  }, [saveProfile]);

  const handelProfileSave = (e) => {
    const productProfileName = e.currentTarget.dataset.product;
    const productPrice = Number(e.currentTarget.dataset.price);
    const productImage = e.currentTarget.dataset.img;

    setSaveProfile((prevProfile) => {
      const profileItem = prevProfile.find(
        (item) => item.name === productProfileName,
      );

      
      if (profileItem) {
        setSaveToast(false);
        setRemoveToast(true);
        clearTimeout(removeTimer.current);
        removeTimer.current = setTimeout(() => {
          setRemoveToast(false)
        },2400);
        return prevProfile.filter((item) => item.name !== productProfileName);
      }

      return [
        ...prevProfile,
        {
          name: productProfileName,
          price: productPrice,
          image: productImage,
        },
      ];

    });

      setSaveToast(true)
    clearTimeout(saveToastTimer.current)
    saveToastTimer.current = setTimeout(() => {
      setSaveToast(false)
    },2400);

  };  

  /////////////////////////////////
  // Data from Laravel APIs
  ////////////////////////////////
  const [Product, setProduct] = useState([]);

  const handleMenu = async () => {
    try{
      const response = await axios.get('http://127.0.0.1:8000/api/user/productList')
      console.log(response.data);
      
      setProduct(response.data.product)
    }catch(e){
      console.log(e);
      
    }
  }

  useEffect(() => {
    handleMenu()
  },[]);

  const categories= [
    "all",
    ...new Set(Product.map((item)=>item.category_name?.toLowerCase()).filter(Boolean))
  ]

  console.log(Product);
  

  return (
    <>
      <main className="menu-page">
        <div className="menu-hero">
          <div>
            <p className="eyebrow">
              <span></span>
              <Link to="/">
                <iconify-icon
                  icon="mingcute:arrow-left-fill"
                  width="24"
                  height="24"
                ></iconify-icon>
                Main Menu
              </Link>
            </p>
            <h1>Curated for your daily ritual.</h1>
          </div>
          <div className="menu-actions">
            <Link className="cart-button" to="/cart">
              View cart <span className="cart-count">{cartCount}</span>
            </Link>
            <p>
              Discover signature coffees, chilled favorites, and fresh bakes
              made for slow mornings and busy afternoons.
            </p>
          </div>
        </div>

        <div className="menu-category-bar" aria-label="Menu categories">
          {categories.map((category) => (
            <button
              key={category}
              className={`menu-category-btn ${
                Filter === category ? "selected" : ""
              }`}
              type="button"
              data-filter="all"
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {Product
            .filter((item) => Filter === "all" || item.category_name?.toLowerCase() === Filter)
            .map((item) => {
              
             const isSaved = saveProfile.some(
              (saveItem) => saveItem.name === item.name
             );
             return(
               <article
                className="menu-card"
                key={item.id}
                data-category={item.category}
              >
                <img src={item.image} alt={item.name} />
                
                <button
                  className={`save-item ${isSaved ? "saved" : ""}`}
                  data-product={item.name}
                  data-price = {(item.price / 100) .toFixed(2)}
                  data-img = {item.image}
                  aria-label={`Save ${item.name}`}
                  title={`Save ${item.name}`}
                  onClick={handelProfileSave}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 2h12v18l-6-3-6 3V2z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="menu-card-content">
                  <div className="menu-card-top">
                    <h3>{item.name}</h3>
                    <span className="menu-rating">★ 4.5 reviews</span>
                  </div>
                  <p>{item.description}</p>
                  <div className="menu-meta">
                    <span className="menu-price">${(item.price / 100).toFixed(2)}</span>
                    <div className="menu-order-controls">
                      <button
                        className="rate-btn"
                        type="button"
                        data-product={item.name}
                        data-rating="4.5"
                        onClick={() => {
                          setSelectedProduct(item.name);
                          setRating(true);
                        }}
                      >
                        Rate ★
                      </button>
                      <span
                        className="product-order-count"
                        data-product-order={item.name}
                      >
                        {getProductQuantity(item.name)}
                      </span>
                      <button
                        className="quick-add-btn"
                        type="button"
                        data-product={item.name}
                        data-price={(item.price / 100).toFixed(2)}
                        data-rating="5.4"
                        data-reviews="128"
                        onClick={handelSave}
                      >
                        Add to order
                      </button>
                    </div>
                  </div>
                </div>
              </article>
             )
})}
        </div>
        {Toast && (
          <div
            className={`rating-alert ${Toast ? "show" : ""}`}
            id="ratingAlert"
            role="status"
            aria-live="polite"
          >
            <button
              className="rating-alert-close"
              type="button"
              aria-label="Close rating alert"
              onClick={() => {
                setToast(false);
                clearTimeout(ToastTimer.current);
              }}
            >
              ×
            </button>

            <strong>Customer favorite</strong>
            <p id="ratingAlertText">Rated 4.8 ★ by 128 happy customers.</p>
          </div>
        )}

        {saveToast && (
          <div
            className={`rating-alert ${saveToast ? "show" : ""}`}
            id="ratingAlert"
            role="status"
            aria-live="polite"
          >
            <button
              className="rating-alert-close"
              type="button"
              aria-label="Close rating alert"
              onClick={() => {
                setSaveToast(false);
                clearTimeout(saveToastTimer.current);
              }}
            >
              ×
            </button>

            <strong>Customer favorite</strong>
            <p id="ratingAlertText"> ★ This Item is Saved Your Profile.</p>
          </div>
        )}

        {removeToast && (
          <div
            className={`rating-alert ${removeToast ? "show" : ""}`}
            id="ratingAlert"
            role="status"
            aria-live="polite"
          >
            <button
              className="rating-alert-close"
              type="button"
              aria-label="Close rating alert"
              onClick={() => {
                setRemoveToast(false);
                clearTimeout(removeToastTimer.current);
              }}
            >
              ×
            </button>

            <strong>Customer favorite</strong>
            <p id="ratingAlertText"> ★ This Item is Unsaved Your Profile.</p>
          </div>
        )}

        
        <div
          className={`rating-popup ${Rating ? "show" : ""}`}
          id="ratingPopup"
          role="dialog"
          aria-modal="true"
          aria-hidden={!Rating}
        >
          <div className="rating-popup-card">
            <strong>Rate this item</strong>
            <p className="rating-popup-copy">
              Tap the stars below to submit your rating. Your selection will
              update the item score instantly.
            </p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rating-star ${
                    selectRating >= star ? "selected" : ""
                  }`}
                  data-rating={star}
                  onClick={handelRating}
                >
                  ★
                </button>
              ))}
            </div>
            <button
              type="button"
              className="rating-popup-cancel"
              onClick={() => setRating(false)}
            >
              Submit
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Menu;
