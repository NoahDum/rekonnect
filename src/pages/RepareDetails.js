import React, { useState, useEffect } from "react";
import HeaderDetails from "../components/HeaderDetails";
import { Link, useParams } from "react-router-dom";
import "../stylesheets/RepareDetails.scss";
import Avatar from "../components/Avatar";
import { BsTelephoneFill } from "react-icons/bs";
import { RiMessage2Fill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { addItem } from "../slices";
import { Button } from "antd";
import Footer from "../components/Footer";

const RepareDetails = () => {
  const [details, setDetails] = useState({});
  const id = useParams().id;
  const dispatch = useDispatch();
  const dataUser = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    const getDetailProduct = async () => {
      const token = dataUser.token
      const headers = {
        'Authorization': `Bearer ${token}`, // Ajoutez le jeton à l'en-tête
      };
      const dataDetailProduct = await fetch(
        `http://localhost/php/rekonnect_api/public/?page=Repare&id=${id}`, {
          headers: headers, // Ajoutez les en-têtes à la requête 
        }
      ).then((res) => res.json());
      setDetails(dataDetailProduct);
    };
    getDetailProduct();
  }, [id]);

  const handleAddItem = () => {
    dispatch(
      addItem({
        itemId: id,
        itemName: details.serviceName,
        price: details.price,
        users_id: details.users_id,
        userName: details.userName,
        pictureOne: details.avatar
      })
    );
  };

  return (
    <div>
      <div className="repare-contain">
        <HeaderDetails />
        <div className="PostForm">
          <div className="repare">
            <div className="product-contain">
              <div className="flexRepare">
                <div className="repare-profile">
                  <div className="repare-avatar">
                    <Avatar
                      imgUrl={
                        details.avatar
                          ? `http://localhost/php/rekonnect_api/public/img/${details.avatar}`
                          : ""
                      }
                    />
                  </div>
                  <div className="repare-contact">
                    <div>
                      <h3>{details.userName}</h3>
                      <p>Note : 4,5/5</p>
                    </div>
                    <div className="contact-link">
                      <a href="tel:0123456789">
                        {" "}
                        <BsTelephoneFill /> 0123456789
                      </a>
                      <Link>
                        {" "}
                        <RiMessage2Fill /> Message
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-repare">
                <h2>{details.serviceName}</h2>
                <p>{details.description}</p>
                <p>{details.price} €</p>
                <Button onClick={handleAddItem}>Ajouter au panier</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Footer/>
    </div>
  );
};

export default RepareDetails;
