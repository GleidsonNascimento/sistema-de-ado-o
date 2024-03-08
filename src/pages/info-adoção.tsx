import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-auth";
import "./modal.css";

const Dados = ({ show, handleClose }) => {
  const [animalType, setAnimalType] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [donationReason, setDonationReason] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("userId");
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      animalType,
      animalBreed,
      animalAge,
      donationReason,
    });
    handleClose();
  };

  return (
    <Modal className="box-modal" show={show} onHide={handleClose}>
      <h2>
        Adicione as informações do animal que você quer colocar para adoção
      </h2>
      <form onSubmit={handleFormSubmit}>
        Tipo de animal que você quer doar
        <input
          type="text"
          value={animalType}
          onChange={(e) => setAnimalType(e.target.value)}
          placeholder="ex cachorro, gato, passarinho"
        />
        Qual a raça do animal?
        <input
          type="text"
          value={animalBreed}
          onChange={(e) => setAnimalBreed(e.target.value)}
          placeholder="ex husk, vira-lata, salsicha"
        />
        quanto tempo de vida?
        <input
          type="text"
          value={animalAge}
          onChange={(e) => setAnimalAge(e.target.value)}
          placeholder="ex 1 ano, 2 anos"
        />
        motivo pelo qual estou doando?
        <input
          type="text"
          value={donationReason}
          onChange={(e) => setDonationReason(e.target.value)}
          placeholder="ex: na minha casa não tem espaço para o filhote"
        />
        <button type="submit">salvar informações</button>
      </form>
      <button onClick={handleClose}>x</button>
    </Modal>
  );
};

export default Dados;
