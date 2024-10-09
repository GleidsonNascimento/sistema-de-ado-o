import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase-auth";
import "./modal.css";

const Editdados = ({ show, handleClose, adData, handleSave }) => {
  const [animalType, setAnimalType] = useState(adData.animalType);
  const [animalBreed, setAnimalBreed] = useState(adData.animalBreed);
  const [animalAge, setAnimalAge] = useState(adData.animalAge);
  const [donationReason, setDonationReason] = useState(adData.donationReason);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSave(adData.id, {
      animalType,
      animalBreed,
      animalAge,
      donationReason,
    });
    handleClose();
  };

  return (
    <Modal className="box-modal" show={show} onHide={handleClose}>
      <h2>Edite as informações do animal que você quer colocar para adoção</h2>
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

export default Editdados;
