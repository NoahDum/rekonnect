import { List, Modal } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../stylesheets/PasswordForget.scss";
import { MdError } from "react-icons/md";

const PasswordForget = () => {
  const [msgUser, setMsgUser] = useState([]);
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function post() {
    const msg = [];
    const emailUser = { email: email };

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      msg.push({ message: "Adresse email invalide" });
    }

    if (msg.length === 0) {
      const data = await fetch(
        "http://localhost/php/rekonnect_api/public/?page=resetpassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(emailUser),
        }
      ).then((response) => response.json());

      if (data.hasOwnProperty("success")) {
        msg.push({ message: data.success });
        setTimeout(() => {
          navigate("/");
        }, 5000);
      } else if (data.hasOwnProperty("errorRequest")) {
        msg.push({ message: data.errorRequest });
      } else {
        msg.push({ message: data.notFound });
      }
    }

    setMsgUser(msg);
  }

  return (
    <div className="passForget">
      <div className="title__app">
        <h1>Mot de passe oublié</h1>
      </div>
      
        <form className="form_pwd_forget" onSubmit={(e) => e.preventDefault()} action="">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            name="email"
            placeholder="Saississez votre adresse email"
          />
          <input
            className="submit_pwd_forget"
            onClick={post}
            type="submit"
            value="Réinitialisation"
          />
        </form>
      
      <Modal
        title="Notification"
        open={msgUser.length > 0}
        onCancel={() => setMsgUser([])}
        footer={null}
        className="modalError"
      >
        <List
          dataSource={msgUser}
          renderItem={(msg) => (
            <List.Item className="list-item">
              <div>
                <MdError className="iconArrowError" />
              </div>
              <div>{msg.message}</div>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default PasswordForget;
