import React, { useEffect, useState } from "react";
import HeaderDetails from "../components/HeaderDetails";
import { useParams } from "react-router-dom";
import "../stylesheets/Product.scss";
import Avatar from "../components/Avatar";
import { BsTelephoneFill } from "react-icons/bs";
import { RiMessage2Fill } from "react-icons/ri";
import { addItem } from "../slices";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import Footer from "../components/Footer";

const Product = () => {
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
        `http://localhost/php/rekonnect_api/public/?page=sell&id=${id}`, {
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
        itemName: details.productName,
        price: details.price,
        users_id: details.users_id,
        userName: details.userName,
        pictureOne: details.pictureOne
      })
    );
  };

  return (
    <div>
      <div className="contain">
        <HeaderDetails />
        <div className="PostForm">
          <div className="product-contain">
            <div className="product-details">
              <div className="product-image">
                <img
                  src={
                    details.pictureOne
                      ? `http://localhost/php/rekonnect_api/public/img/${details.pictureOne}`
                      : ""
                  }
                  alt=""
                />
              </div>

              <div className="details-profile">
                <div className="avatar-product">
                  <Avatar
                    imgUrl={
                      details.avatar
                        ? `http://localhost/php/rekonnect_api/public/img/${details.avatar}`
                        : ""
                    }
                  />
                </div>

                <div>
                  <h3>{details.userName}</h3>
                  <p>Note : 4,5/5</p>
                </div>
                <a href={`tel:${details.phone}`}>
                  {" "}
                  <BsTelephoneFill size={20} />
                  {details.phone}
                </a>
                <a href="/">
                  <RiMessage2Fill size={25} />
                  Message
                </a>
              </div>
            </div>
            <div className="details">
              <h2>{details.productName}</h2>
              <p>{details.description}</p>
              <p>{details.price}</p>
              <Button onClick={handleAddItem}>Ajouter au panier</Button>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>

  );
};
export default Product;
