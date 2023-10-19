import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../stylesheets/Sell.scss";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Sell = () => {
  const [postList, setPostlist] = useState([]);
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const [filter, setFilter] = useState({
    search: "",
    priceMin: "",
    priceMax: "" ? Number(1000000) : "",
  });

  const toFilter = (e) => {
    const { name, value } = e.target;
    setFilter((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const navigate = useNavigate();
  const isDataAvailable = !!localStorage.getItem("user");

  useEffect(() => {
    let timeout;
    if (!isDataAvailable) {
      timeout = setTimeout(() => {
        navigate("/");
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [isDataAvailable, navigate]);

  //funtion GEtDATA qui permet de faire un fetch des donnée venant du back
  const functionGetData = (link) => {
    const getData = async () => {
      // Récupérez le jeton d'authentification depuis localStorage
      const token = dataUser.token

      const headers = {
        'Authorization': `Bearer ${token}`, // Ajoutez le jeton à l'en-tête
      };
      const datas = await fetch(link, {
        headers: headers, // Ajoutez les en-têtes à la requête 
      })
        .then((res) => res.json())
        .catch((err) => err);

      setPostlist(datas);
      console.log(postList)

    };
    getData();
  };
  useEffect(() => {
    functionGetData("http://localhost/php/rekonnect_api/public/?page=sell");
  }, []);

  const list = postList.map((list) => {
    return (
      <div key={list.id} className="product">
        <img
          className="sell-image"
          src={`http://localhost/php/rekonnect_api/public/img/${list.pictureOne}`}
          alt={list.pictureOne}
        />
        <div className="desc-Product">
          <h3>{list.productName}</h3>
          <p>{list.description}</p>
        </div>
        <div>
          <h3>{list.price}€</h3>
          <Link to={`/product/${list.id}`}>Voir plus</Link>
        </div>
      </div>
    );
  });

  let toExecuteFilter = () => {
    functionGetData(
      `http://localhost/php/rekonnect_api/public/?page=sell&action=filter&pricemin=${filter.priceMin ? filter.priceMin : 0
      }&pricemax=${filter.priceMax ? filter.priceMax : 100000}&search=${filter.search
      }`
    );
    console.log(postList);
  };

  return (
    <div className="Sell">
      <Header isHome={false} />
      {isDataAvailable ? (
        <div className="contain">
          <div className="image">
            <img
              className="repair"
              src="/assets/img/sell-image.png"
              alt="fond sch_rep"
            />
            <div className="head-page">
              <h1>Espace Ventes</h1>
              <div className="post-sell">
                <Link to={"/post-sell"}>
                  <IoIosAddCircle /> Vendre mon produit
                </Link>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="filter">
              <div className="title">
                <h2>Filtres</h2>
              </div>
              <form
                action=""
                method="get"
                className="search"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <input
                  type="text"
                  placeholder="Cherchez un produit"
                  name="search"
                  onChange={toFilter}
                />

                <input
                  type="number"
                  name="priceMin"
                  id="PriceMin"
                  placeholder="Prix minimum"
                  onChange={toFilter}
                />
                <input
                  type="number"
                  name="priceMax"
                  id="PriceMax"
                  placeholder="Prix maximum"
                  onChange={toFilter}
                />
                <input
                  type="submit"
                  value="Rechercher"
                  className="search-submit "
                  onClick={toExecuteFilter}
                />
              </form>
            </div>
            <div className="product-list">
              <div className="title">
                <h2>Produits correspodants à : {filter.search
                }</h2>
              </div>
              {list}
            </div>
          </div>
        </div>
      ) : (
        <div className="error">
          <h1>Vous n'etes pas connecté ! </h1>
          <h2>
            Vous ne pouvez pas acceder à cette page, veuillez attendre la
            redirection pour vous connecter.
          </h2>
          <div class="wrapper">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Sell;
