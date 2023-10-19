import React, { useState } from "react";
import HeaderDetails from "../components/HeaderDetails";
import { useNavigate } from "react-router-dom";
import "../stylesheets/PostSell.scss";
import { List, Modal } from "antd";
import { MdError } from "react-icons/md";
import Footer from "../components/Footer";

const PostRepare = () => {
  const navigate = useNavigate();

  const dataUser = JSON.parse(localStorage.getItem("user"));

  const [serviceName, setserviceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const userName = dataUser.name;
  const users_id = dataUser.id;

  const [errors, setErrors] = useState([]);

  async function postrepare(event) {
    const newErrors = [];

    event.preventDefault();
    if (serviceName && userName && users_id && description && price) {
      const dataUser = {
        serviceName: serviceName,
        price: price,
        userName: userName,
        users_id: users_id,
        description: description,
      };
      await fetch(
        "http://localhost/php/rekonnect_api/public/?page=postrepare",
        {
          method: "POST",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify(dataUser),
        }
      ).then((res) => res.json());

      if (newErrors.length > 0) {
        setErrors(newErrors);
      } else {
        navigate("/SearchRepair");
      }
    } else {
      newErrors.push({ message: "Veuillez remplir tous les champs" });
      setErrors(newErrors);
    }
  }

  return (
    <div>
      <HeaderDetails />
      <div className="PostForm">
        <h1>Poster mon annonce de réparation</h1>

        <Modal
          title="Erreurs de post"
          open={errors.length > 0}
          onCancel={() => setErrors([])}
          footer={null}
          className="modalError"
        >
          <List
            dataSource={errors}
            renderItem={(error) => (
              <List.Item className="list-item">
                <div>
                  <MdError className="iconArrowError" />
                </div>
                <div>{error.message}</div>
              </List.Item>
            )}
          />
        </Modal>
        <form onSubmit={postrepare} encType="multipart/form-data">
          <div className="PostItem">
            <label htmlFor="UserNameInput"></label>
            <input
              type="hidden"
              name="userName"
              id="UserNameInput"
              value={dataUser.name}
              readOnly
            />
          </div>
          <div className="PostItem">
            <label htmlFor="UsersIdInput"></label>
            <input
              type="hidden"
              name="users_id"
              id="UsersIdInput"
              value={dataUser.id}
              readOnly
            />
          </div>
          <div className="PostItem">
            <label htmlFor="pNameInput"> </label>
            <input
              type="text"
              placeholder="Nom du service"
              name="serviceName"
              id="pNameInput"
              onChange={(e) => setserviceName(e.target.value)}
            />
          </div>
          <div className="PostItem">
            <label htmlFor="descriptionInput"></label>
            <input
              type="text"
              placeholder="Description"
              name="description"
              id="descriptionInput"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="PostItem">
            <label htmlFor="PriceInput"></label>
            <input
              type="number"
              placeholder="Prix"
              id="PriceInput"
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <input type="submit" value="Poster l'annonce" className="Submit"/>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostRepare;
