import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { List, Modal } from "antd";
import { MdError } from "react-icons/md";
import HeaderDetails from "../components/HeaderDetails";
import "../stylesheets/NewPassword.scss";

const NewPassword = () => {
  const [form, setForm] = useState({
    password: "",
    passwordConfirm: "",
  });

  const newErrors = [];

  const [errors, setErrors] = useState([]);

  const navigate = useNavigate();

  const saisie = (e) => {
    const { name, value } = e.target;
    setForm((state) => ({
      ...state,
      [name]: value,
    }));
  };
  const tok = useLocation().search;
  const token = tok.replace("?token=", "");

  const data = {
    token: token,
    password: form.password,
    passwordConfirm: form.passwordConfirm,
  };

  let post = async () => {
    if (form.password === form.passwordConfirm) {
      let request = await fetch(
        "http://localhost/php/rekonnect_api/public/?page=newpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(data),
        }
      ).then((response) => response.json());

      if (request === "success") {
        navigate("/");
      }
    } else {
      newErrors.push({
        message: "Les mots de passes saisis ne sont pas identique",
      });
      setErrors(newErrors);
    }
  };

  return (
    <div className="new-pwd">
      <HeaderDetails />
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
      <h1>Réinitialisation de votre mot de passe</h1>

      <form onSubmit={(e) => e.preventDefault()} action="">

        <input onChange={saisie} type="password" name="password" placeholder="Saisisser le nouveau mot de passe"/>

        <input onChange={saisie} type="password" name="passwordConfirm" placeholder="Confirmer le nouveau mot de passe"/>

        <input onClick={post} type="submit" className="submit-new-pwd"/>
      </form>
    </div>
  );
};

export default NewPassword;
