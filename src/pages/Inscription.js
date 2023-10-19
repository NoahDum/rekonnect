import { List, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "../stylesheets/Inscription.scss";
import { MdError } from "react-icons/md";

const Inscription = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [buyer, setBuyer] = useState(0);
  const [repairer, setRepairer] = useState(0);
  const [seller, setSeller] = useState(0);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState([]);

  const [iconSeller, setIconSeller] = useState('/assets/img/seller_off.png');
  const [iconBuyer, setIconBuyer] = useState('/assets/img/buyer_off.png');
  const [iconRepairer, setIconRepairer] = useState('/assets/img/repairer_off.png');

  function checkedBuyer() {
    if (buyer === 0) {
      setBuyer(1);
      setIconBuyer('/assets/img/buyer_on.png');
    } else {
      setBuyer(0);
      setIconBuyer('/assets/img/buyer_off.png');
    }
  }

  function checkedSeller() {
    if (seller === 0) {
      setSeller(1);
      setIconSeller('/assets/img/seller_on.png');
    } else {
      setSeller(0);
      setIconSeller('/assets/img/seller_off.png');
    }
  }

  function checkedRepare() {
    if (repairer === 0) {
      setRepairer(1);
      setIconRepairer('/assets/img/repairer_on.png');
    } else {
      setRepairer(0);
      setIconRepairer('/assets/img/repairer_off.png');
    }
  }

  async function signUp(event) {
    event.preventDefault();

    const newErrors = [];

    if (name.length < 3) {
      newErrors.push({ message: "Nom invalide (3 caractères min.)" });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      newErrors.push({ message: "Format adresse email invalide" });
    }

    const specCharsRegex = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const digitRegex = /[0-9]/;

    if (
      password.length < 8 ||
      !specCharsRegex.test(password) ||
      !upperRegex.test(password) ||
      !lowerRegex.test(password) ||
      !digitRegex.test(password)
    ) {
      newErrors.push({
        message:
          "Mot de passe invalide (majucule, minuscule, chiffre, caractère spécial, 8 caractères min.)",
      });
    }

    if (email !== emailConfirm) {
      newErrors.push({ message: "Confirmation adresse email invalide" });
    }

    if (password !== passwordConfirm) {
      newErrors.push({ message: "Confirmation mot de passe invalide" });
    }

    if (phone.length < 10 || phone.length > 10) {
      newErrors.push({ message: "Numéro de téléphone invalide" });
    }

    if (seller === 0 && buyer === 0 && repairer === 0) {
      newErrors.push({ message: "Veuillez cocher au moins une case" });
    }

    if (newErrors.length === 0) {
      const dataUser = {
        name: name,
        email: email,
        emailConfirm: emailConfirm,
        password: password,
        passwordConfirm: passwordConfirm,
        phone: phone,
        seller: seller,
        buyer: buyer,
        repairer: repairer,
      };

      const data = await fetch(
        "http://localhost/php/rekonnect_api/public/?page=users",
        {
          method: "POST",
          headers: { "Content-Type": "application/json;charset=utf-8" },
          body: JSON.stringify(dataUser),
        }
      ).then((response) => response.json());

      if (data.hasOwnProperty("error")) {
        newErrors.push({ message: data.error });
      } else {
        newErrors.push({
          message: "Inscription effectuée avec succès! Redirection...",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    }
    setErrors(newErrors);
  }

  return (
    <div className="sign_up">
      <Header />
      <div className="login-container">
        <div className="bg_login">
          <img src="/assets/img/login-image.png" alt="fond sch_rep" />
        </div>
        <div className="login-contain">
          <div className="title">
            <h1>Inscription</h1>
          </div>
          <form className="form_login" onSubmit={signUp}>
              <div className="form_item">
                <label htmlFor="nameInput"></label>
                <input
                  type="text"
                  name="name"
                  id="nameInput"
                  placeholder="Nom d'utilisateur"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="phoneInput"></label>
                <input
                  type="number"
                  name="phone"
                  id="phoneInput"
                  placeholder="Numéro de téléphone"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="emailInput"></label>
                <input
                  type="email"
                  name="email"
                  id="emailInput"
                  placeholder="Adresse email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="emailInputConfirm"></label>
                <input
                  type="email"
                  name="emailConfirm"
                  id="emailInputConfirm"
                  placeholder="Confirmer votre adresse email"
                  onChange={(e) => setEmailConfirm(e.target.value)}
                />
              </div>

              <div className="form_item">
                <label htmlFor="passwordInput"></label>
                <input
                  type="password"
                  name="password"
                  id="passwordInput"
                  placeholder="Mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form_item">
                <label htmlFor="passwordInputConfirm"></label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id="passwordInputConfirm"
                  placeholder="Confirmer votre mot de passe"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>

            <div className="form_group">
              <div className="check_item">
                <label htmlFor="sellerCheck">Vendeur ?</label>
                <p>
                  <img src={iconSeller} alt="seller" onClick={() => checkedSeller()} />
                </p>
              </div>
              <div className="check_item">
                <label htmlFor="buyerCheck">
                  Acheteur ?
                  <p>
                    <img src={iconBuyer} alt="buyer" onClick={() => checkedBuyer()} />
                  </p>
                </label>
              </div>
              <div className="check_item">
                <label htmlFor="repairerCheck">Réparateur ?</label>
                <p>
                  <img src={iconRepairer} alt="repairer" onClick={() => checkedRepare()} />
                </p>
              </div>
            </div>

            <input className="submit_login" type="submit" value="Inscription" />
          </form>
          <Modal
            title="Erreurs de formulaire"
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
        </div>
      </div>
      {/* <div className="bg_login">
        <img src="/assets/img/login.jpeg" alt="fond sch_rep" />
      </div>
      <div className="title">
        <h1>Inscription</h1>
      </div>
      <Modal
        title="Erreurs de formulaire"
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

      <form className="form_sign_up" onSubmit={signUp}>
        <div className="form_group">
          <div className="form_item">
            <label htmlFor="nameInput"></label>
            <input
              type="text"
              name="name"
              id="nameInput"
              placeholder="Nom d'utilisateur"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form_item">
            <label htmlFor="phoneInput"></label>
            <input
              type="number"
              name="phone"
              id="phoneInput"
              placeholder="Numéro de téléphone"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        <div className="form_group">
          <div className="form_item">
            <label htmlFor="emailInput"></label>
            <input
              type="email"
              name="email"
              id="emailInput"
              placeholder="Adresse email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form_item">
            <label htmlFor="emailInputConfirm"></label>
            <input
              type="email"
              name="emailConfirm"
              id="emailInputConfirm"
              placeholder="Confirmer votre adresse email"
              onChange={(e) => setEmailConfirm(e.target.value)}
            />
          </div>
        </div>

        <div className="form_group">
          <div className="form_item">
            <label htmlFor="passwordInput"></label>
            <input
              type="password"
              name="password"
              id="passwordInput"
              placeholder="Mot de passe"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form_item">
            <label htmlFor="passwordInputConfirm"></label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordInputConfirm"
              placeholder="Confirmer votre mot de passe"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
        </div>

        <div className="form_group">
          <div className="check_item">
            <label htmlFor="sellerCheck">Vendeur ?</label>
            <p>
              <img src={iconSeller} alt="seller" onClick={() => checkedSeller()} />
            </p>
          </div>
          <div className="check_item">
            <label htmlFor="buyerCheck">
              Acheteur ?
              <p>
                <img src={iconBuyer} alt="buyer" onClick={() => checkedBuyer()} />
              </p>
            </label>
          </div>
          <div className="check_item">
            <label htmlFor="repairerCheck">Réparateur ?</label>
            <p>
              <img src={iconRepairer} alt="repairer" onClick={() => checkedRepare()} />
            </p>
          </div>
        </div>

        <input className="submit_sign_up" type="submit" value="Inscription" />
      </form> */}
    </div>
  );
};

export default Inscription;
