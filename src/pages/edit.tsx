import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase-auth";
import locations from "./utilitarios/locais";
import "./modal.css";

const Editdados = ({ show, handleClose, adData, handleSave }) => {
  const [animalName, setAnimalName] = useState(adData.animalName);
  const [animalType, setAnimalType] = useState(adData.animalType);
  const [animalBreed, setAnimalBreed] = useState(adData.animalBreed);
  const [animalAge, setAnimalAge] = useState(adData.animalAge);
  const [donationReason, setDonationReason] = useState(adData.donationReason);
  const [location, setLocation] = useState(adData.location);
  const [sex, setSex] = useState(adData.sex);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSave(adData.id, {
      animalName,
      animalType,
      animalBreed,
      animalAge,
      donationReason,
      location,
      sex,
    });
    handleClose();
  };

  return (
    <Modal className="box-modal" show={show} onHide={handleClose}>
      <h2>Edite as informações do animal que você quer colocar para adoção</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Nome do animal</label>
        <input
          type="text"
          value={animalName}
          onChange={(e) => setAnimalName(e.target.value)}
          placeholder="ex: Fido, Whiskers"
        />
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
        <label>qual sexo do animal</label>
        <select value={sex} onChange={(e) => setSex}>
          <option value="">Qual sexo?</option>
          <option value={sex}>Femea</option>
          <option value={sex}>Macho</option>
        </select>
        <label>Local onde o animal está</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">selecione o local</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
        </select>
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
