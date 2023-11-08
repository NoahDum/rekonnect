import Modal from "antd/es/modal/Modal";
import React, { useEffect, useState } from "react";
import { RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import "../stylesheets/Profile.scss";

const MySell = () => {
  const [mySells, setMySells] = useState([]);
  const [mySellName, setMySellName] = useState("");
  const [mySellDescription, setMySellDescription] = useState("");
  const [mySellPrice, setMySellPrice] = useState("");
  const [modalInfos, setModalInfos] = useState(false);
  const [mySellId, setMySellId] = useState("");
  const dataUser = JSON.parse(localStorage.getItem("user"));

  //function fetch de get mySell pour eviter les répétition de code
  const token = dataUser.token
  let functionGetMySell = (link) => {
    const getMySells = async () => {
      const headers = {
        'Authorization': `Bearer ${token}`, // Ajoutez le jeton à l'en-tête
      };
      let dataMysells = await fetch(link, {
        headers: headers, // Ajoutez les en-têtes à la requête 
      }).then((res) => res.json());
      setMySells(dataMysells);
    };
    getMySells();
  };


  useEffect(() => {
    functionGetMySell(
      `http://localhost/php/rekonnect_api/public/?page=sell&mysells=${dataUser.id}`
    );
  }, [dataUser.id]);

  let listMySells = mySells.map((mysell) => {
    const newMySell = {
      productName: mySellName,
      description: mySellDescription,
      price: mySellPrice,
    };

    let post = async () => {
      await fetch(
        ` http://localhost/php/rekonnect_api/public/?page=sell&id=${mySellId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json;charset=utf-8",  'Authorization': `Bearer ${token}`, },
          body: JSON.stringify(newMySell),
        }
      ).then((res) => res.json());
      functionGetMySell(
        `http://localhost/php/rekonnect_api/public/?page=sell&mysells=${dataUser.id}`
      );
      setModalInfos(false);
    };

    let del = async () => {
      await fetch(
        `http://localhost/php/rekonnect_api/public/?page=sell&id=${mysell.id}`,
        {
          headers: { "Content-Type": "application/json;charset=utf-8",  'Authorization': `Bearer ${token}`, },
          method: "DELETE",
        }
      ).then((res) => res.json());
      functionGetMySell(
        `http://localhost/php/rekonnect_api/public/?page=sell&mysells=${dataUser.id}`
      );
    };

    return (
      <div key={mysell.id} className="list">
        <img
          src={
            mysell.pictureOne
              ? `http://localhost/php/rekonnect_api/public/img/${mysell.pictureOne}`
              : ""
          }
          alt=""
        />
        <p>{mysell.productName}</p>
        <p className="description">{mysell.description}</p>
        <p>{mysell.price}</p>
        <div className="link">
          <RiDeleteBin5Fill size={22} onClick={del} />
          <RiEdit2Fill
            size={22}
            onClick={() => {
              setModalInfos(true);
              setMySellName(mysell.productName);
              setMySellDescription(mysell.description);
              setMySellPrice(mysell.price);
              setMySellId(mysell.id);
            }}
          />
        </div>
        <Modal
          title="Modification de vos informations de vente "
          open={modalInfos}
          onCancel={() => setModalInfos(false)}
          footer={null}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="form-group">
              <div>
                <label htmlFor="nameInput">nom du produit</label>
                <input
                  type="text"
                  name="productName"
                  id="nameInput"
                  placeholder={`nom du produit : ${mySellName}`}
                  onChange={(e) => {
                    setMySellName(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <div>
                <label htmlFor="descriptionInput">description</label>
                <input
                  type="text"
                  name="description"
                  id="desscriptionInput"
                  placeholder={`description : ${mySellDescription}`}
                  onChange={(e) => {
                    setMySellDescription(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <div>
                <label htmlFor="priceInput">price</label>
                <input
                  type="number"
                  name="price"
                  id="priceInput"
                  placeholder={`prix : ${mySellPrice}`}
                  onChange={(e) => {
                    setMySellPrice(e.target.value);
                  }}
                />
              </div>
            </div>

            <input
              className="submit"
              type="submit"
              value="Mettre à jour"
              onClick={post}
            />
          </form>
        </Modal>
      </div>
    );
  });

  return (
    <div id="sell">
      <h3>Mes ventes</h3>
      {<div className="list-flex">{listMySells}</div>}
    </div>
  );
};

export default MySell;
