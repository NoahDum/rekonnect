import React, { useState, useEffect, useRef } from "react";
import { RiEdit2Fill, RiDeleteBin5Fill } from "react-icons/ri";
import { Modal } from "antd";
import "../stylesheets/Profile.scss";

const Myrepare = () => {
  const [myRepare, setMyRepare] = useState([]);

  const [serviceName, setserviceName] = useState("");
  const [repareprice, setrepareprice] = useState("");
  const [reparedescription, setreparedescription] = useState("");
  const [repareId, setrepareid] = useState("");
  const [modalRepare, setModalRepare] = useState(false);

  const dataUser = JSON.parse(localStorage.getItem("user"));
  const formRef = useRef();

  let functionGetMyRepare = (link) => {
    const getMyRepare = async () => {
      let dataMyrepare = await fetch(link).then((res) => res.json());
      setMyRepare(dataMyrepare);
    };
    getMyRepare();
  };

  useEffect(() => {
    functionGetMyRepare(
      `http://localhost/php/rekonnect_api/public/?page=Repare&myrepare=${dataUser.id}`
    );
  }, [dataUser.id]);

  let listMyRepare = myRepare.map((myrepare) => {
    async function updateRepare(event) {
      event.preventDefault();
      const newReparePost = {
        repareId: repareId,
        serviceName: serviceName,
        repareprice: repareprice,
        reparedescription: reparedescription,
      };

      await fetch(
        `http://localhost/php/rekonnect_api/public/?page=Repare&id=${myrepare.id}`,
        {
          method: "PUT",

          body: JSON.stringify(newReparePost),
        }
      ).then((response) => response.json());
      functionGetMyRepare(
        `http://localhost/php/rekonnect_api/public/?page=Repare&myrepare=${dataUser.id}`
      );
      setModalRepare(false);
      formRef.current.reset();
    }

    let deleteRepare = async () => {
      await fetch(
        `http://localhost/php/rekonnect_api/public/?page=Repare&id=${myrepare.id}`,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());

      functionGetMyRepare(
        `http://localhost/php/rekonnect_api/public/?page=Repare&myrepare=${dataUser.id}`
      );
    };

    return (
      <div key={myrepare.id} className="list">
        <p>{myrepare.serviceName}</p>
        <p className="description">{myrepare.description}</p>
        <p>{myrepare.price}</p>

        <div className="link">
          <RiDeleteBin5Fill size={22} onClick={() => deleteRepare()} />
          <RiEdit2Fill
            size={22}
            onClick={() => {
              setrepareid(myrepare.id);
              setserviceName(myrepare.serviceName);
              setrepareprice(myrepare.price);
              setreparedescription(myrepare.description);
              setModalRepare(true);
            }}
          />
        </div>

        <Modal
          title={`Modification du post n° ${repareId}`}
          open={modalRepare}
          onCancel={() => setModalRepare(false)}
          footer={null}
        >
          <form ref={formRef} onSubmit={updateRepare}>
            <div className="form-group">
              <div>
                <label htmlFor="ServNameInput">Nom du service</label>
                <input
                  type="text"
                  name="serviceName"
                  id="ServNameInput"
                  placeholder={`Nom actuel : ${serviceName}`}
                  onChange={(e) => setserviceName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div>
                <label htmlFor="ReaprePriceInput">Prix</label>
                <input
                  type="number"
                  name="repareprice"
                  id="ReaprePriceInput"
                  placeholder={`Prix actuel : ${repareprice}`}
                  onChange={(e) => setrepareprice(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <div>
                <label htmlFor="RepareDescInput">Description</label>
                <input
                  type="text"
                  name="reparedescription"
                  id="RepareDescInput"
                  placeholder={`Description actuelle : ${reparedescription}`}
                  onChange={(e) => setreparedescription(e.target.value)}
                />
              </div>
            </div>
            <input className="submit" type="submit" value="Mettre à jour" />
          </form>
        </Modal>
      </div>
    );
  });

  return (
    <div id="repare">
      <h3>Mes réparations</h3>

      <div className="list-flex">{listMyRepare}</div>
    </div>
  );
};

export default Myrepare;
