import React, { useState } from "react";
import Header from "../components/Header";
import "../stylesheets/Cart.scss";
import { ImBin } from "react-icons/im";
import { deleteItem, paidCart } from "../slices";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { MdError } from "react-icons/md";
import Footer from "../components/Footer";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentCart = useSelector((state) => state.cart);
  const currentUser = useSelector((state) => state.user);
  const [msgUser, setMsgUser] = useState("");
  const dataUser = JSON.parse(localStorage.getItem("user"));


  const handleDelete = (itemId) => {
    dispatch(deleteItem({ itemId }));
  };

  const objectIds = currentCart.items.map((item) => item.itemId);

  const handlepayment = async () => {
    const token = dataUser.token

    if (objectIds.length !== 0) {
      const data = await fetch(
        "http://localhost/php/rekonnect_api/public/?page=payment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: currentUser.id,
            totalCmd: currentCart.total,
            objectIds: objectIds,
          }),
        }
      ).then((response) => response.json());

      if (data["msgUser"].msgUser === "Panier validé avec succès") {
        setMsgUser(data["msgUser"].msgUser);
        const wallet = currentUser.wallet;
        const total = currentCart.total;
        dispatch(paidCart({ wallet: wallet, totalCmd: total }));
        localStorage.removeItem("cart");
        setTimeout(() => {
          navigate("/profile");
        }, 4000);
      } else {
        setMsgUser(data["msgUser"].msgUser);
      }
    } else {
      setMsgUser('Votre panier est vide !');
    }
  };

  return (
    <div className="cart">
      <Header />
      <div className="contain">
        <div className="image">
          <img
            className="repair"
            src="/assets/img/cart-image.png"
            alt="fond sch_rep"
          />
          <div className="head-page">
            <h1 className="ProfilTitle">Votre Panier</h1>
          </div>
        </div>
        <div className="cart-List">
          <ul>
            {currentCart.items.map((item) => (
              <li key={item.itemId}>
                <div className="Cart-Image">
                  <img
                    src={
                      item.pictureOne
                        ? `http://localhost/php/rekonnect_api/public/img/${item.pictureOne}`
                        : "Aucune image"
                    }
                    alt=""
                  />
                </div>

                <div>{item.itemName}</div>
                <div>Prix : {item.price} €</div>
                <div>Quantité : {item.quantity}</div>
                <span className="iconSupp">
                  <ImBin onClick={() => handleDelete(item.itemId)} />
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="total">
          <p>Total : {currentCart.total} €</p>
          <Button onClick={handlepayment}>Finaliser la commande</Button>
        </div>
        <Modal
          title="Statut du paiement"
          open={msgUser !== ""}
          onCancel={() => setMsgUser("")}
          footer={null}
        >
          <div>
            <MdError className="iconArrowError" />
            {msgUser}
          </div>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
