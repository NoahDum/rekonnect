import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/Profile.scss";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { List, Modal } from "antd";
import { RiEdit2Fill } from "react-icons/ri";
import { MdError } from "react-icons/md";
import Avatar from "../components/Avatar";
import Dropzone from "react-dropzone";
import Myrepare from "../components/Myrepare";
import MySell from "../components/MySell";
import Wallet from "../components/Wallet";
import Footer from "../components/Footer";

const Profile = () => {
  const navigate = useNavigate();
  const dataUser = JSON.parse(localStorage.getItem("user"));
  const formRef = useRef();

  const [activeLink, setActiveLink] = useState("profil");
  const [modalInfos, setModalInfos] = useState(false);

  const [msgUser, setMsgUser] = useState([]);

  const [name, setName] = useState(dataUser ? dataUser.name : "");
  const [email, setEmail] = useState(dataUser ? dataUser.email : "");
  const [adress, setAdress] = useState(dataUser ? dataUser.adress : "");
  const [adress_delivery, setAdress_delivery] = useState(
    dataUser ? dataUser.adress_delivery : ""
  );
  const [seller, setSeller] = useState(dataUser ? dataUser.seller : 0);
  const [buyer, setBuyer] = useState(dataUser ? dataUser.buyer : 0);
  const [repairer, setRepairer] = useState(dataUser ? dataUser.repairer : 0);
  const [phone, setPhone] = useState(dataUser ? dataUser.phone : "");

  const [avatarUrl, setAvatarUrl] = useState(
    dataUser.avatar
      ? "http://localhost/php/rekonnect_api/public/img/" + dataUser.avatar
      : "https://placehold.it/130x130"
  );

  useEffect(() => {
    let timeout;
    if (!dataUser) {
      timeout = setTimeout(() => {
        navigate("/");
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [dataUser, navigate]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  // Fct update avatar ---------------
  async function handleDrop(files) {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setAvatarUrl(reader.result);
    };

    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("id", dataUser.id);

    const data = await fetch(
      "http://localhost/php/rekonnect_api/public/?page=postAvatar",
      {
        method: "POST",
        body: formData,
      }
    ).then((response) => response.json());

    dataUser["avatar"] = data;
    localStorage.setItem("user", JSON.stringify(dataUser));
  }
  // -----------------------------------------------------------

  function checkedBuyer() {
    if (buyer === 0) {
      setBuyer(1);
    } else {
      setBuyer(0);
    }
  }

  function checkedSeller() {
    if (seller === 0) {
      setSeller(1);
    } else {
      setSeller(0);
    }
  }

  function checkedRepare() {
    if (repairer === 0) {
      setRepairer(1);
    } else {
      setRepairer(0);
    }
  }

  async function updateInfos(event) {
    event.preventDefault();

    const errorMsg = [];

    if (name.length < 3) {
      errorMsg.push({ message: "Nom invalide (3 caractères min.)" });
      formRef.current.elements.name.value = "";
      setName(dataUser.name);
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      errorMsg.push({ message: "Format adresse email invalide" });
      formRef.current.elements.email.value = "";
      setEmail(dataUser.email);
    }

    if (phone.length < 10 || phone.length > 10) {
      errorMsg.push({ message: "Numéro de téléphone invalide" });
      formRef.current.elements.phone.value = "";
      setPhone(dataUser.phone);
    }

    if (seller === 0 && buyer === 0 && repairer === 0) {
      errorMsg.push({ message: "Veuillez cocher au moins une case" });
    }

    if (errorMsg.length === 0) {
      const newDataUser = {
        id: dataUser.id,
        name: name,
        email: email,
        adress: adress,
        adressDelivery: adress_delivery,
        seller: seller,
        buyer: buyer,
        repairer: repairer,
        phone: phone,
      };

      const token = dataUser.token
      const data = await fetch(
        "http://localhost/php/rekonnect_api/public/?page=dataupdate",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json;charset=utf-8",  'Authorization': `Bearer ${token}` },
          body: JSON.stringify(newDataUser),
        }
      ).then((response) => response.json());

      localStorage.setItem("user", JSON.stringify(data));
      setModalInfos(false);
      formRef.current.reset();
    }
    setMsgUser(errorMsg);
  }

  return (
    <div className="profile">
      <Header />
      {dataUser ? (
        <div>
          <div className="contain">
            <div className="image">
              <img
                className="repair"
                src="/assets/img/profile-image.png"
                alt="fond sch_rep"
              />
              <div className="head-page">
                <h1 className="ProfilTitle">Mon profil</h1>
              </div>
            </div>
            <div className="profile-nav">
              {/* <Link to="/profile#buy" onClick={() => handleLinkClick("buy")}>
                Mes achats
              </Link> */}
              <Link
                to="/profile#repare"
                onClick={() => handleLinkClick("repare")}
              >
                Mes réparations
              </Link>
              <Link to="/profile#sell" onClick={() => handleLinkClick("sell")}>
                Mes ventes
              </Link>
              <Link
                to="/profile#profil"
                onClick={() => handleLinkClick("profil")}
              >
                Mon profil
              </Link>
              <Link
                to="/profile#wallet"
                onClick={() => handleLinkClick("wallet")}
                className="Wallet-link"
              >
                Mon porte-monnaie
              </Link>
            </div>

            {activeLink === "profil" && (
              <div className="flex-profil">
                <div id="profil">
                  <div className="card">
                    <div className="avatar-container">
                      <Avatar imgUrl={avatarUrl} />
                      <Dropzone
                        onDrop={handleDrop}
                        minSize={0}
                        maxSize={2097152}
                      >
                        {({ getRootProps, getInputProps, rejectedFiles }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <RiEdit2Fill className="upload" size={25} />
                          </div>
                        )}
                      </Dropzone>
                    </div>

                    <div className="card-info">
                      <h3>{dataUser.name}</h3>
                      <div className="statut">
                        <ul>
                          <li>
                            {dataUser.seller ? (
                              <img
                                alt="seller_icon"
                                src="/assets/img/seller_on.png"
                              />
                            ) : (
                              ""
                            )}
                            {dataUser.buyer ? (
                              <img
                                alt="buyer_icon"
                                src="/assets/img/buyer_on.png"
                              />
                            ) : (
                              ""
                            )}
                            {dataUser.repairer ? (
                              <img
                                alt="repair_icon"
                                src="/assets/img/repairer_on.png"
                              />
                            ) : (
                              ""
                            )}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="perso-info">
                    <p>Nom d'utilisateur : {dataUser.name}</p>
                    <p>Email : {dataUser.email}</p>
                    <p>Contact : {dataUser.phone}</p>
                    <p>
                      Adresse de Facturation :{" "}
                      {dataUser.adress === "Aucune"
                        ? "Vous n'avez pas encore renseigné d'adresse"
                        : dataUser.adress}
                    </p>
                    <p>
                      Adresse de Livraison :{" "}
                      {dataUser.adress_delivery === "Aucune"
                        ? "Vous n'avez pas encore renseigné d'adresse"
                        : dataUser.adress_delivery}
                    </p>
                  </div>
                </div>

                <button
                  className="btn_modif"
                  onClick={() => setModalInfos(true)}
                >
                  Modifier vos informations
                </button>
                <Modal
                  title="Modification de vos informations personnelles"
                  open={modalInfos}
                  onCancel={() => setModalInfos(false)}
                  footer={null}
                >
                  <form ref={formRef} onSubmit={updateInfos}>
                    <div>
                      <input
                        className="item"
                        type="text"
                        name="name"
                        id="nameInput"
                        placeholder={`Nom actuel : ${dataUser.name}`}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        className="item"
                        type="text"
                        name="email"
                        id="emailInput"
                        placeholder={`Email actuel : ${dataUser.email}`}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        className="item"
                        type="number"
                        name="phone"
                        id="phoneInput"
                        placeholder={`Contact actuel : ${dataUser.phone}`}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="checkbox-group">
                      <div className="flex-check">
                        <p>
                          <label htmlFor="sellerCheck">Vendeur</label>
                        </p>
                        <input
                          type="checkbox"
                          name="seller"
                          id="sellerCheck"
                          onChange={() => checkedSeller()}
                          checked={seller === 1 ? true : false}
                        />
                      </div>
                      <div className="flex-check">
                        <p>
                          <label htmlFor="buyerCheck">Acheteur</label>
                        </p>
                        <input
                          type="checkbox"
                          name="buyer"
                          id="buyerCheck"
                          onChange={() => checkedBuyer()}
                          checked={buyer === 1 ? true : false}
                        />
                      </div>
                      <div className="flex-check">
                        <p>
                          <label htmlFor="repairerCheck">Réparateur</label>
                        </p>
                        <input
                          type="checkbox"
                          name="repairer"
                          id="repairerCheck"
                          onChange={() => checkedRepare()}
                          checked={repairer === 1 ? true : false}
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        className="item"
                        type="text"
                        name="adressDelivery"
                        id="adressDeliveryInput"
                        placeholder={
                          dataUser.adress_delivery
                            ? `Adresse renseignée : ${dataUser.adress_delivery}`
                            : "Aucune adresse renseignée"
                        }
                        onChange={(e) =>
                          setAdress_delivery(e.target.value.toUpperCase())
                        }
                      />
                    </div>
                    <div>
                      <input
                        className="item"
                        type="text"
                        name="adress"
                        id="adressInput"
                        placeholder={
                          dataUser.adress
                            ? `Adresse renseignée : ${dataUser.adress}`
                            : "Aucune adresse renseignée"
                        }
                        onChange={(e) =>
                          setAdress(e.target.value.toUpperCase())
                        }
                      />
                    </div>

                    <input
                      className="submit_update_profile"
                      type="submit"
                      value="Mettre à jour"
                    />
                  </form>
                </Modal>
                <Modal
                  className="modal-error"
                  title="Erreur de saisie"
                  open={msgUser.length > 0}
                  onCancel={() => setMsgUser([])}
                  footer={null}
                >
                  <List
                    dataSource={msgUser}
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
              </div>
            )}

            {/* {activeLink === "buy" && (
              <div id="buy">
                <h3>Mes achats</h3>

                <div className="list-flex">
                  <div className="list">
                    <p className="fakeImage">image</p>
                    <p>Nom de l'article</p>
                    <p className="description">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Aperiam eum iusto commodi, harum quisquam ab sunt maxime
                      quasi, similique, in ducimus explicabo quidem odit molestiae
                      tempore eaque inventore! Optio, pariatur!
                    </p>
                    <p>prix</p>
                  </div>
                  <div className="list">
                    <p className="fakeImage">image</p>
                    <p>Nom de l'article</p>
                    <p className="description">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Aperiam eum iusto commodi, harum quisquam ab sunt maxime
                      quasi, similique, in ducimus explicabo quidem odit molestiae
                      tempore eaque inventore! Optio, pariatur!
                    </p>
                    <p>prix</p>
                  </div>
                  <div className="list">
                    <p className="fakeImage">image</p>
                    <p>Nom de l'article</p>
                    <p className="description">
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Aperiam eum iusto commodi, harum quisquam ab sunt maxime
                      quasi, similique, in ducimus explicabo quidem odit molestiae
                      tempore eaque inventore! Optio, pariatur!
                    </p>
                    <p>prix</p>
                  </div>
                </div>
              </div>
            )} */}

            {activeLink === "repare" && <Myrepare />}

            {activeLink === "sell" && <MySell />}

            {activeLink === "wallet" && <Wallet />}
          </div>
          <Footer />
        </div>
      ) : (
        <div className="error">
          <h1>Vous n'etes pas connecté ! </h1>
          <h2>
            Vous ne pouvez pas acceder à cette page, veuillez attendre la
            redirection pour vous connecter.
          </h2>
          <div className="wrapper">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
            <div className="shadow"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
