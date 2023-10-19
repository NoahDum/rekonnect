import { List, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import "./stylesheets/App.scss";
import { MdError } from "react-icons/md";
import PasswordForget from "./pages/PasswordForget";

function SplashScreen() {
  return (
    <div className="splash_screen">
      <div className="title_logo">
        <p>Rek</p>
        <img src="/assets/img/logo_solo_blanc_transparent.png" alt="" />
        <p>nnect</p>
      </div>
      <div className="loading">
        <p>Chargement...</p>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();

  const [showSplash, setShowSplash] = useState(true);
  const [resetPwd, setResetPwd] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const splashShown = JSON.parse(localStorage.getItem("splashShown"));
    if (
      splashShown &&
      splashShown.shown &&
      splashShown.expiration > new Date().getTime()
    ) {
      setShowSplash(false);
    } else {
      const now = new Date().getTime();
      const expiration = now + 3600 * 1000; // Date limite d'expiration = maintenant + 1 heure
      localStorage.setItem(
        "splashShown",
        JSON.stringify({ shown: true, expiration })
      );
      setTimeout(() => {
        setShowSplash(false);
      }, 3000);
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    const newErrors = [];

    const dataUser = { name: username, password: password };

    const data = await fetch(
      "http://localhost/php/rekonnect_api/public/?page=login",
      {
        method: "POST",
        body: JSON.stringify(dataUser),
      }
    ).then((response) => response.json());

    if (data.hasOwnProperty("error")) {
      newErrors.push({ message: data.error });
    } else {
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/profile");
    }
    setErrors(newErrors);
  };

  return (
    <div className="App">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <Header />
          <Modal
            title="Erreur de connexion"
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
          <div className="login-container">
            <div className="bg_login">
              <img src="/assets/img/login-image.png" alt="fond sch_rep" />
            </div>
            <div className="login-contain">
              <div className="title">
                <h1>Se connecter</h1>
              </div>
              <form className="form_login" onSubmit={login}>
                <div>
                  <label htmlFor="nameInput"></label>
                  <input
                    type="text"
                    name="name"
                    id="nameInput"
                    placeholder="Nom d'utilisateur"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="passwordInput"></label>
                  <input
                    type="password"
                    name="password"
                    id="passwordInput"
                    placeholder="Mot de passe"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="no__compte">
                  <div className="no_account">
                    Pas encore de compte ?{" "}
                    <Link to="/registered">S'inscrire</Link>
                  </div>
                </div>

                <input
                  className="submit_login"
                  type="submit"
                  value="Connexion"
                />
                <div
                  onClick={() => {
                    setResetPwd(true);
                  }}
                  className="forgot_pwd"
                >
                  Mot de passe oublié ?
                </div>
              </form>
              <Modal
                open={resetPwd}
                onCancel={() => setResetPwd(false)}
                footer={null}
                className="modalError"
              >
                <PasswordForget />
              </Modal>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
