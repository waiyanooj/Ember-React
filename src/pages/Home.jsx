import { logout } from "../services/auth.js";
import { getProducts } from "../services/products.js";
import { useEffect, useRef, useState } from "react";
import "../styles/style.css";
import "../styles/profileBtn.css";
import { Link } from "react-router-dom";

const Home = () => {
  // Loading Animation
  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // အကယ်၍ user က scroll လိုက်လို့ target Observer ထဲ (Screen View ) ထဲရောက်လာရင် Animation တစ်ကြိမ်ပြမယ်။ ပြီးရင် unObserve လုပ်မယ်

  useEffect(() => {
    if (Loading) return;
    const revealObsever = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObsever.unobserve(entry.target);
          }
        });
      },

      {
        threshold: 0.12,
      },
    );

    const revealElement = document.querySelectorAll(".reveal");

    revealElement.forEach((element) => {
      revealObsever.observe(element);
    });

    return () => {
      revealObsever.disconnect();
    };
  }, [Loading]);

  // Scroll Smoot ကို JS နဲ့ ရေးခြင်း

  const handelScroll = (target) => {
    document.querySelector(target)?.scrollIntoView({
      behavior: "smoot",
    });
  };

  // active section ရောက်ရင် nav button မှာ active color ပြမယ်

  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observe = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".main-nav a").forEach((a) => {
              a.classList.toggle(
                "active",
                a.getAttribute("href") === `#${entry.target.id}`,
              );
            }); // foreach
          } // if
        }); // foreach
      }, // entries

      {
        rootMargin: "-35% 0px -55% 0px",
      },
    );

    sections.forEach((section) => {
      observe.observe(section);
    });

    return () => {
      observe.disconnect();
    };
  }, []);

  // Add to Cart System

  // Toast Notification

  const [Toast, setToast] = useState(false);

  let ToastTimer = useRef(null);

  const [cart, setCart] = useState(() => {
    const saveCart = localStorage.getItem("cart");

    return saveCart ? JSON.parse(saveCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleCart = (e) => {
    const productName = e.currentTarget.dataset.product;
    const productPrice = Number(e.currentTarget.dataset.price);

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === productName);

      if (existingItem) {
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
          price: productPrice,
          quantity: 1,
        },
      ];
    });

    // Toast Notification
    setToast(true);

    clearTimeout(ToastTimer.current);

    ToastTimer.current = setTimeout(() => {
      setToast(false);
    }, 2400);
  };
  // Cart Count System

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [Filter, setFilter] = useState("all");

  const [userOldData, setUserOldData] = useState(() => {
    const saveData = localStorage.getItem("userData");
    console.log(saveData);

    return saveData ? JSON.parse(saveData) : null;
  });

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      console.log("TOKEN:", token);

      await logout(
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      localStorage.removeItem("token");
      localStorage.removeItem("userData");

      setUserOldData(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  console.log(userOldData);

  const [product, setProduct] = useState([]);

  const handleMenu = async () => {
    try {
      const response = await getProducts();

      console.log(response.data);

      setProduct(response.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleMenu();
  }, []);

  const categories = [
    "all",
    ...new Set(
      product.map((item) => item.category_name?.toLowerCase()).filter(Boolean),
    ),
  ];

  const saveData = localStorage.getItem("userData");
  console.log("userData =", saveData);

  return (
    <>
      <div className="Home">
        {Loading && (
          <div className="loading-screen" id="loadingScreen" aria-hidden="true">
            <div className="loading-orb">
              <img src="/Img/animation.png" alt="Cortado coffee" />
            </div>
            <div className="loading-text">
              <span>Ember</span>
              <span>&amp;</span>
              <span>Bean</span>
            </div>
          </div>
        )}
        <div className="cursor-glow"></div>
        <header className="site-header" id="top">
          <a className="brand" href="#top" aria-label="Ember and Bean home">
            <span className="brand-mark">e</span>
            <span>
              EMBER
              <br />
              &amp; BEAN
            </span>
          </a>
          <nav className="main-nav" aria-label="Main navigation">
            <a
              className="active"
              href="#home"
              onClick={() => handelScroll("#home")}
            >
              Home
            </a>
            <a href="#menu" onClick={() => handelScroll("#menu")}>
              Menu
            </a>
            <a href="#story" onClick={() => handelScroll("#story")}>
              Our story
            </a>
            <a href="#visit" onClick={() => handelScroll("#visit")}>
              Visit us
            </a>
          </nav>
          <div className="header-actions">
            {userOldData ? (
              <button className="login-button" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link className="login-button" to="/login">
                Login
              </Link>
            )}
            <button
              className="profile-button"
              aria-label="Profile"
              title="Profile"
              onClick={() => {
                window.location.href = "/profile";
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
            </button>
            <Link className="order-button cart-link" to="/cart">
              Your order <b className="cart-count">{cartCount}</b>
              <span>↗</span>
            </Link>
          </div>
          <button className="menu-toggle" aria-label="Open menu">
            <i></i>
            <i></i>
          </button>
        </header>

        <main>
          <section className="hero" id="home">
            <div className="hero-copy reveal">
              <p className="eyebrow">
                <span></span> EST. 2018 · MANDALAY
              </p>
              <h1>
                Good days
                <br />
                start with <em>great</em>
                <br />
                coffee.
              </h1>
              <p className="hero-text">
                Thoughtfully sourced beans, baked-this-morning pastries, and
                your favorite corner table.
              </p>
              <div className="hero-actions">
                <button className="dark-button" data-scroll="#menu">
                  Explore the menu <span>↓</span>
                </button>
                <a className="text-link" href="#visit">
                  Find our café <span>→</span>
                </a>
              </div>
            </div>
            <div className="hero-visual reveal">
              <div className="sun-disc"></div>
              <div className="hero-image-wrap">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=85"
                  alt="Fresh coffee being poured"
                />
              </div>
              <div className="hero-caption">
                SLOWLY, WITH INTENTION
                <br />
                <b>01 / 04</b>
              </div>
              <div className="stamp">
                FRESH
                <br />
                ROASTED
                <br />
                <span>✦</span>
              </div>
            </div>
            <div className="scroll-note">
              SCROLL TO DISCOVER <span>↓</span>
            </div>
          </section>

          <section className="intro-strip">
            <p>
              YOUR NEIGHBORHOOD
              <br />
              <em>ALL DAY</em> COFFEE HOUSE
            </p>
            <span className="asterisk">✳</span>
            <p>
              POURED WITH
              <br />
              <em>CARE</em> EVERY DAY
            </p>
            <span className="asterisk">✳</span>
            <p>
              MAKE YOURSELF
              <br />
              <em>AT HOME</em>
            </p>
          </section>

          <section className="menu-section" id="menu">
            <div className="section-heading reveal">
              <div>
                <p className="eyebrow">
                  <span></span> OUR FAVORITES
                </p>
                <h2>
                  A little something
                  <br />
                  for <em>every mood.</em>
                </h2>
              </div>
              <Link className="text-link" to="/menu">
                View full menu <span>→</span>
              </Link>
            </div>
            <div className="menu-tabs reveal" role="tablist">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`${Filter === category ? "selected" : ""}`}
                  onClick={() => setFilter(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
            <div className="product-grid">
              {product
                .filter(
                  (item) =>
                    Filter === "all" ||
                    item.category_name?.toLowerCase() === Filter,
                )
                .slice(0, 4)
                .map((item) => (
                  <article
                    className="product-card "
                    key={item.id}
                    data-category={item.category_name}
                  >
                    <div className="product-image tan">
                      <span className="item-number">{item.id}</span>
                      <img src={item.image} alt={item.name} />
                      <button
                        className="quick-add"
                        data-product={item.name}
                        data-price={item.price / 100}
                        aria-label={`Add ${item.name}`}
                        onClick={handleCart}
                      >
                        +
                      </button>
                    </div>
                    <div className="product-info">
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                      </div>
                      <strong>${(item.price / 100).toFixed(2)}</strong>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          <section className="story-section" id="story">
            <div className="story-image reveal">
              <img
                src="https://images.unsplash.com/photo-1517231925375-bf2cb42917a5?auto=format&fit=crop&w=1000&q=85"
                alt="Warm and welcoming coffee shop interior"
              />
              <div className="image-label">
                THE EMBER &amp; BEAN
                <br />
                WAY · SINCE 2018
              </div>
            </div>
            <div className="story-copy reveal">
              <p className="eyebrow">
                <span></span> A LITTLE ABOUT US
              </p>
              <h2>
                More than
                <br />
                <em>just a cup.</em>
              </h2>
              <p>
                We believe a neighborhood café should feel like a small exhale.
                A place for early ideas, long lunches, and the kind of
                conversation that makes you miss your bus.
              </p>
              <p>
                Everything starts with curious people and exceptional
                ingredients—from our rotating coffee partners to the local
                bakers we call friends.
              </p>
              <a className="dark-button" href="our-story.html">
                Our story <span>→</span>
              </a>
            </div>
          </section>

          <section className="visit-section" id="visit">
            <div className="visit-card reveal">
              <p className="eyebrow">
                <span></span> COME SAY HELLO
              </p>
              <h2>
                Your table
                <br />
                is <em>waiting.</em>
              </h2>
              <div className="details">
                <div>
                  <small>FIND US</small>
                  <p>
                    42nd Street, between
                    <br />
                    78th &amp; 79th · Mandalay
                  </p>
                </div>
                <div>
                  <small>OPEN DAILY</small>
                  <p>
                    Mon–Fri 7am–6pm
                    <br />
                    Sat–Sun 8am–5pm
                  </p>
                </div>
              </div>
              <a
                className="text-link light"
                href="https://maps.app.goo.gl/ieYzkuZ1wN25A2SB6"
                target="_blank"
                rel="noreferrer"
              >
                Get directions <span>↗</span>
              </a>
            </div>
            <div className="visit-image reveal">
              <img
                src="https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=85"
                alt="Coffee shop counter"
              />
              <div className="open-badge">
                <span>OPEN</span>
                <b>
                  7<br />
                  AM
                </b>
                <i>—</i>
                <b>
                  6<br />
                  PM
                </b>
              </div>
            </div>
          </section>
        </main>
        <footer>
          <a className="brand" href="#top">
            <span className="brand-mark">e</span>
            <span>
              EMBER
              <br />
              &amp; BEAN
            </span>
          </a>
          <p>Made for unhurried mornings.</p>
          <div>
            <a href="#home">Instagram</a>
            <a href="#home">Contact</a>
            <a href="#home">Journal</a>
          </div>
          <small>© 2024 EMBER &amp; BEAN</small>
        </footer>
        {Toast && (
          <div className="toast show" role="status">
            Added to your order <span onClick={() => setToast(false)}>×</span>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
