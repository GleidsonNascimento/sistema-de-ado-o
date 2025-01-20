import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import locations from "./utilitarios/locais";
import { db } from "./firebase-auth";
import "./modal.css";

const Dados = ({ show, handleClose }) => {
  const [animalType, setAnimalType] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [donationReason, setDonationReason] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [animalName, setAnimalName] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storage = getStorage();

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const userId = sessionStorage.getItem("userId");

    if (
      !userId ||
      !imageFile ||
      !animalName ||
      !animalType ||
      !animalBreed ||
      !animalAge ||
      !donationReason ||
      !location ||
      !sex
    ) {
      setError("Todos os campos são obrigatórios.");
      setLoading(false);
      return;
    }

    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          setError("Erro ao carregar a imagem.");
          setLoading(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "ads"), {
            userId,
            animalName,
            animalType,
            animalBreed,
            animalAge,
            donationReason,
            location,
            sex,
            imageUrl: downloadURL,
          });

          setLoading(false);
          handleClose();
        }
      );
    } catch (error) {
      setError("Erro ao salvar as informações.");
      setLoading(false);
    }
  };

  return (
    <Modal className="box-modal" show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Adicione as informações do animal para adoção</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleFormSubmit}>
          <label>Nome do animal</label>
          <input
            type="text"
            value={animalName}
            onChange={(e) => setAnimalName(e.target.value)}
            placeholder="ex: Fido, Whiskers"
          />
          <label>Tipo de animal</label>
          <input
            type="text"
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
            placeholder="ex: cachorro, gato, passarinho"
          />
          <label>Raça</label>
          <input
            type="text"
            value={animalBreed}
            onChange={(e) => setAnimalBreed(e.target.value)}
            placeholder="ex: husky, vira-lata"
          />
          <label>Idade</label>
          <input
            type="text"
            value={animalAge}
            onChange={(e) => setAnimalAge(e.target.value)}
            placeholder="ex: 1 ano, 2 anos"
          />
          <label>Motivo da doação</label>
          <input
            type="text"
            value={donationReason}
            onChange={(e) => setDonationReason(e.target.value)}
            placeholder="ex: não tenho mais espaço"
          />
          <label>qual sexo do animal</label>
          <select value={sex} onChange={(e) => setSex}>
            <option value="">Qual sexo?</option>
            <option value={sex}>Femea</option>
            <option value={sex}>Macho</option>
          </select>
          <label>Local onde o animal está</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">selecione o local</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <label>Foto do animal</label>
          <input type="file" onChange={handleImageChange} />
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Informações"}
          </Button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Fechar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Dados;
