import React, { useEffect, useState } from "react";
import "../stylesheets/Header.scss";
import { useNavigate } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { useSelector } from "react-redux";

const Header = () => {
  const navigate = useNavigate();

  const isDataAvailable = !!localStorage.getItem("user");
  const currentCart = useSelector((state) => state.cart);
  const [storageUser, setStorageUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const totalItemsCart = currentCart.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  useEffect(() => {
    const handleStorageChange = () => {
      setStorageUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  function deconnexion() {
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="App-header">
      <div
        onClick={() => {
          navigate(isDataAvailable ? "/profile" : "/");
        }}
        className="link"
      >
        <p>Rek</p>
        <img src="/assets/img/logo_solo_blanc_transparent.png" alt="" />
        <p>nnect</p>
      </div>

      {isDataAvailable ? (
        <section className="top-nav">
          <input id="menu-toggle" type="checkbox" />
          <label className="menu-button-container" htmlFor="menu-toggle">
            <div className="menu-button"></div>
          </label>
          <ul className="menu">
            <li
              className="nav_link"
              onClick={() => navigate("/profile#wallet")}
            >
              <IoWallet size={20} />
              <p>: {storageUser.wallet} €</p>
            </li>
            <li className="nav_link" onClick={() => navigate("/sell")}>
              Ventes
            </li>
            <li className="nav_link" onClick={() => navigate("/SearchRepair")}>
              Réparations
            </li>
            <li className="nav_link" onClick={() => navigate("/profile")}>
              Profil
            </li>
            <li
              className="nav_link"
              id="Icon"
              onClick={() => navigate("/cart")}
            >
              <span className="nbItemsCart">{totalItemsCart}</span>
              <FaShoppingCart size={20} />
            </li>
            <li
              className="nav_link"
              id="Icon"
              onClick={() => deconnexion()}
            >
              <AiOutlineLogout size={20} />
            </li>
          </ul>
        </section>
      ) : (
        <section className="top-nav">
          <input id="menu-toggle" type="checkbox" />
          <label className="menu-button-container" htmlFor="menu-toggle">
            <div className="menu-button"></div>
          </label>
          <ul className="menu">
            <li className="nav_link" onClick={() => navigate("/registered")}>
              S'inscrire
            </li>
            <li className="nav_link" onClick={() => navigate("/")}>
              Se connecter
            </li>
          </ul>
        </section>
      )}
    </header>
  );
};

export default Header;
