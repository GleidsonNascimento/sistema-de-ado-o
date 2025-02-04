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
  const [size, setSize] = useState("");
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

    if (!userId) {
      setError("Usuário não está autenticado.");
      setLoading(false);
      return;
    }

    if (!size) {
      setError("Selecione um tamanho");
      setLoading(false);
      return;
    }

    if (!imageFile) {
      setError("Selecione uma imagem para o animal.");
      setLoading(false);
      return;
    }

    if (animalName.trim() === "") {
      setError("O campo 'Nome do animal' é obrigatório.");
      setLoading(false);
      return;
    }

    if (animalType.trim() === "") {
      setError("O campo 'Tipo de animal' é obrigatório.");
      setLoading(false);
      return;
    }

    if (animalBreed.trim() === "") {
      setError("O campo 'Raça' é obrigatório.");
      setLoading(false);
      return;
    }

    if (animalAge.trim() === "") {
      setError("O campo 'Idade' é obrigatório.");
      setLoading(false);
      return;
    }

    if (donationReason.trim() === "") {
      setError("O campo 'Motivo da doação' é obrigatório.");
      setLoading(false);
      return;
    }

    if (sex.trim() === "") {
      setError("Selecione o sexo do animal.");
      setLoading(false);
      return;
    }

    if (location.trim() === "") {
      setError("Selecione o local onde o animal está.");
      setLoading(false);
      return;
    }

    try {
      const storageRef = ref(storage, `images/${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        () => {},
        (error) => {
          console.error("Erro ao carregar a imagem:", error);
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
            size,
            imageUrl: downloadURL,
          });

          setLoading(false);
          handleClose();
        }
      );
    } catch (error) {
      console.error("Erro ao salvar as informações:", error);
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
          <label>Qual sexo do animal</label>
          <select value={sex} onChange={(e) => setSex(e.target.value)}>
            <option value="">Qual sexo?</option>
            <option value="Fêmea">Fêmea</option>
            <option value="Macho">Macho</option>
          </select>
          <label>Qual tamanho do animal</label>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Qual tamanho?</option>
            <option value="Pequeno">Pequeno</option>
            <option value="Medio">Medio</option>
            <option value="Grande">Grande</option>
          </select>
          <label>Local onde o animal está</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Selecione o local</option>
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
