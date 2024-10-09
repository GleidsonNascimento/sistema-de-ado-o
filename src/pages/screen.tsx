import React, { useState, useEffect, useCallback } from "react";
import { Button } from "react-bootstrap";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase-auth";
import Dados from "./info-adoção";
import Editdados from "./edit";
import "./screen.css";
import Navbar from "./header";

const Imagem = ({ currentUser }) => {
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [ads, setAds] = useState([]);
  const [editingAd, setEditingAd] = useState(null);

  const toggleModal = () => setShow(!show);

  const fetchUserAds = useCallback(async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));

      if (!userDoc.exists()) {
        console.error("Documento de usuário não encontrado.");
        return;
      }

      const userData = userDoc.data();
      setUserName(userData.name);
      setImageUrl(userData.profilePic);

      const q = query(collection(db, "ads"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      setAds(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Erro ao buscar os dados do usuário: ", error);
    }
  }, []);

  const handleDelete = async (adId) => {
    try {
      await deleteDoc(doc(db, "ads", adId));
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== adId));
    } catch (error) {
      console.error("Erro ao deletar o anúncio: ", error);
    }
  };

  const handleEdit = (adId) => setEditingAd(adId);

  const handleSaveEdit = async (adId, updatedData) => {
    try {
      await updateDoc(doc(db, "ads", adId), updatedData);
      setEditingAd(null);
    } catch (error) {
      console.error("Erro ao salvar a edição: ", error);
    }
  };

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      fetchUserAds(userId);
    } else {
      console.error("User ID não encontrado na sessão");
    }
  }, [fetchUserAds, currentUser]);

  return (
    <div className="con-profile">
      <Navbar />
      <div className="box-box">
        <Button
          className="button-addition"
          variant="primary"
          onClick={toggleModal}
        >
          +
        </Button>
        {ads.map((ad) => (
          <div key={ad.id} className="box-dados">
            <h3>Informações do Animal:</h3>
            {ad.imageUrl ? (
              <img
                src={ad.imageUrl}
                alt="Imagem do animal"
                style={{ width: "250px", height: "200px" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "default-image-url";
                }}
              />
            ) : (
              <p>Imagem não disponível</p>
            )}
            <p>Nome: {ad.animalName}</p>
            <p>Tipo: {ad.animalType}</p>
            <p>Raça: {ad.animalBreed}</p>
            <p>Idade: {ad.animalAge}</p>
            <p>Motivo da doação: {ad.donationReason}</p>
            <button className="button-dados" onClick={() => handleEdit(ad.id)}>
              Editar
            </button>
            <button
              className="button-dados"
              onClick={() => handleDelete(ad.id)}
            >
              Excluir
            </button>
          </div>
        ))}
      </div>

      <Dados show={show} handleClose={toggleModal} />
      {editingAd && (
        <Editdados
          show={true}
          handleClose={() => setEditingAd(null)}
          adData={ads.find((ad) => ad.id === editingAd)}
          handleSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default Imagem;
