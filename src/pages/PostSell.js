import React, { useState } from "react";
import HeaderDetails from "../components/HeaderDetails";
import { useNavigate } from "react-router-dom";
import "../stylesheets/PostSell.scss";
import { List, Modal } from "antd";
import { MdError } from "react-icons/md";
import Footer from "../components/Footer";
import { AiOutlineUpload } from "react-icons/ai";

const PostSell = () => {
  const navigate = useNavigate();

  const dataUser = JSON.parse(localStorage.getItem("user"));

  const [productName, setproductName] = useState("");
  // const [inputPictureTwo, setInputPictureTwo] = useState("");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const userName = dataUser.name;
  const users_id = dataUser.id;

  const [errors, setErrors] = useState([]);

  async function postsell(event) {
    const newErrors = [];

    event.preventDefault();
    if (
      productName &&
      // inputPictureTwo &&
      file &&
      userName &&
      users_id &&
      description &&
      price
    ) {
      // const dataUser = {
      //     productName: productName,
      //     // inputPictureTwo: inputPictureTwo,
      //     inputPictureOne: file,
      //     description: description,
      //     price: price,
      // };
      const formData = new FormData();
      formData.append("inputPictureOne", file);
      formData.append("productName", productName);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("userName", userName);
      formData.append("users_id", users_id);

      await fetch(
        "http://localhost/php/rekonnect_api/public/?page=postsell",
        {
          method: "POST",
          body: formData,
        }
      ).then((response) => response.json());

      navigate("/sell");
    }
    setErrors(newErrors);
  }

  return (
    <div>
      <HeaderDetails />
      <div className="PostForm">
        <h1>Vendre mon produit</h1>
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

        <form onSubmit={postsell} encType="multipart/form-data" >
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
              placeholder="Nom du produit"
              name="productName"
              id="pNameInput"
              onChange={(e) => setproductName(e.target.value)}
            />
          </div>
          <div className="product-picture PostItem">
            <label htmlFor="inputPictureOne"><AiOutlineUpload/> Choisir un fichier </label>
            <input
              type="file"
              name="inputPictureOne"
              id="inputPictureOne"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {/* <label htmlFor="inputPictureTwo">Photo 2 du produit :</label>
                    <input type="file" name="inputPictureTwo" id="inputPictureTwo" onChange={(e) => setInputPictureTwo(e.target.value)} /> */}
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
          <input type="submit" value="Ajouter le produit" className="Submit"/>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default PostSell;
