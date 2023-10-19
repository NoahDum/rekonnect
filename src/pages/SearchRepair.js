import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../stylesheets/Repare.scss";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";
import Footer from "../components/Footer";

function SearchRepair() {
  const navigate = useNavigate();
  const isDataAvailable = !!localStorage.getItem("user");
  const dataUser = JSON.parse(localStorage.getItem("user"));


  const [postList, setPostlist] = useState([]);

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

  let toExecuteFilter = () => {
    functionGetData(
      `http://localhost/php/rekonnect_api/public/?page=Repare&action=filter&pricemin=${filter.priceMin ? filter.priceMin : 0
      }&pricemax=${filter.priceMax ? filter.priceMax : 100000}&search=${filter.search
      }`
    );
  };

  useEffect(() => {
    let timeout;
    if (!isDataAvailable) {
      timeout = setTimeout(() => {
        navigate("/");
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [isDataAvailable, navigate]);

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
        .catch((err) => (err));

      setPostlist(datas);
    };
    getData();
  };
  useEffect(() => {
    functionGetData("http://localhost/php/rekonnect_api/public/?page=Repare");
  }, []);

  const list = postList.map((list) => {
    return (
      <div key={list.id} className="product">
        <div className="avatar-repair">
          <Avatar
            imgUrl={`http://localhost/php/rekonnect_api/public/img/${list.avatar}`}
          />
        </div>
        <div className="desc-repair">
          <h3>{list.serviceName}</h3>
          <p>{list.description}</p>
        </div>
        <div className="info-repair">
          <h3>{list.price}€</h3>
          <Link to={`/repare-details/${list.id}`}>Voir plus</Link>
        </div>
      </div>
    );
  });

  return (
    <div className="search_repairD">
      <Header />
      {isDataAvailable ? (
        <div className="contain">
          <div className="image">
            <img
              className="repair"
              src="/assets/img/repare-image.png"
              alt="fond sch_rep"
            />
            <div className="head-page">
              <h1>Espace Réparation</h1>
              <div className="post-sell">
                <Link to={"/post-repare"}>
                  <IoIosAddCircle /> Poster une annonce{" "}
                </Link>
              </div>
            </div>
          </div>
          {/* <div>
            <form action="" method="get" className="search">
              <FcSearch />
              <input type="text" placeholder='Rechercez votre produit...' />
              <input type="submit" value="Entrer" id='enter' />
            </form>
          </div> */}
          {/* 
          <div className="flex-items">
            <div className='search_user'>
              <p>Votre recherche : (variable_search)</p>
            </div>
            <div className="post-sell">
              <Link to={"/post-repare"}><IoIosAddCircle /> Poster une anonce</Link>
            </div>
          </div> */}

          <div className="container">
            <div className="filter">
              <div className="title">
                <h2>Filtres</h2>
              </div>
              <form
                action=""
                method="get"
                className="search"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  name="search"
                  placeholder="Cherchez un produit"
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
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default SearchRepair;
