import React, { useState, useRef } from "react";
import { IoWallet } from "react-icons/io5";
import { Modal } from "antd";
import "../stylesheets/Profile.scss";


const Wallet = () => {
    const dataUser = JSON.parse(localStorage.getItem("user"));
    const [addSold, setSold] = useState("");
    const [supSold, setSupSold] = useState("");

    const [modalAdd, setModalAdd] = useState(false);
    const [modalRemove, setModalRemove] = useState(false);
    const formRef = useRef();

    async function updateInfos(event) {
        event.preventDefault();

        const errorMsg = [];

        if (errorMsg.length === 0) {
            let newSolde = ""
            if (addSold !== "") {
                newSolde = +addSold + +dataUser.wallet
                setSold("")
            }
            let newSold = ""
            if (supSold !== "") {
                newSold = dataUser.wallet - supSold
                setSupSold("")
            }


            const newWallet = {
                id: dataUser.id,
                sold: addSold ? newSolde : newSold
            };


            const token = dataUser.token

            await fetch(
                "http://localhost/php/rekonnect_api/public/?page=soldUpdate",
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json;charset=utf-8",  'Authorization': `Bearer ${token}`, },
                    body: JSON.stringify(newWallet),
                }
            ).then((response) => response.json());

            dataUser.wallet = addSold ? newSolde : newSold;
            localStorage.setItem("user", JSON.stringify(dataUser));
            setModalAdd(false);
            setModalRemove(false);
            formRef.current.reset();
        }
    }

    return (
        <div id="wallet">
            <div className="wallet-flex">
                <IoWallet size={70} />
                <h1>Mon solde : </h1>
                <h2> {dataUser.wallet} €</h2>

                <div className="boutons">
                    <button onClick={() => setModalAdd(true)}>
                        Ajouter du solde
                    </button>
                    <button onClick={() => setModalRemove(true)}>
                        Virer vers mon compte
                    </button>
                </div>
            </div>
            <Modal
                title={`Ajout de solde pour ${dataUser.name}`}
                open={modalAdd}
                onCancel={() => setModalAdd(false)}
                footer={null}
            >
                <form ref={formRef} onSubmit={updateInfos}>
                    <div className="form-group">
                        <div>
                            <label htmlFor="SoldeInput">Veuillez entrer le solde à ajouter :</label>
                            <input
                                type="number"
                                name="sold"
                                id="SoldeInput"
                                placeholder={`Solde actuel : ${dataUser.wallet}`}
                                onChange={(e) => setSold(e.target.value)}
                            />
                        </div>
                    </div>
                    <input
                        className="submit"
                        type="submit"
                        value="Mettre à jour"
                    />
                </form>
            </Modal>
            <Modal
                title={`Retrait de solde pour ${dataUser.name}`}
                open={modalRemove}
                onCancel={() => setModalRemove(false)}
                footer={null}
            >
                <form ref={formRef} onSubmit={updateInfos}>
                    <div className="form-group">
                        <div>
                            <label htmlFor="SoldeInput">Veuillez entrer le solde à retirer :</label>
                            <input
                                type="number"
                                name="sold"
                                id="SoldeInput"
                                placeholder={`Solde actuel : ${dataUser.wallet}`}
                                onChange={(e) => setSupSold(e.target.value)}
                            />
                        </div>
                    </div>
                    <input
                        className="submit"
                        type="submit"
                        value="Mettre à jour"
                    />
                </form>
            </Modal>
            {/* <Modal
              title="Validation de l'ajout"
              open={msgUser.length > 0}
              onCancel={() => setMsgUser([])}
              footer={null}
            >
              <List
                dataSource={msgUser}
                renderItem={(error) => (
                  <List.Item className="list-item">
                    <div>
                      <RiCheckboxCircleFill className="iconArrowError" />
                    </div>
                    <div>{error.message}</div>
                  </List.Item>
                )}
              />
            </Modal> */}
        </div>
    )
}

export default Wallet