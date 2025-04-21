import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import locations from "./utilitarios/locais";
import TextareaAutosize from "react-textarea-autosize";
import { db } from "./firebase-auth";
import "./modal.css";

const Dados = ({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) => {
  const [animalType, setAnimalType] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalAge, setAnimalAge] = useState("");
  const [donationReason, setDonationReason] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [animalName, setAnimalName] = useState("");
  const [sex, setSex] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState("");
  const [about, setAbout] = useState("");
  const [characteristics, setCharacteristics] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const storage = getStorage();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setImageFile(files[0]);
    }
  };

  const handleCharacteristicsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, checked } = e.target;
    setCharacteristics((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const availableCharacteristics = [
    "Vacinado",
    "Vermifugado",
    "Castrado",
    "Amigável com crianças",
    "Amigável com outros animais",
    "Não é amigável com crianças",
    "Não é amigável com outros animais",
    "Protetor",
    "Brincalhão",
    "Calmo",
    "Independente",
    "Treinado",
  ];

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
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
    if (about.trim() === "") {
      setError("O campo 'Sobre' é obrigatório.");
      setLoading(false);
      return;
    }
    if (phone.trim() === "") {
      setError("O campo 'Telefone' é obrigatório.");
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
            about,
            size,
            phone,
            characteristics,
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
    <div>
      <div className="modal-background">
        <Modal className="box-modal" show={show} onHide={handleClose}>
          <Modal.Header>
            <Button className="close" onClick={handleClose}>
              X
            </Button>
            <Modal.Title className="titulo-modal">
              Adicione as informações do animal para adoção
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleFormSubmit}>
              <label className="label-title">Nome do animal</label>
              <input
                type="text"
                value={animalName}
                onChange={(e) => setAnimalName(e.target.value)}
                placeholder="ex: Fido, Whiskers"
              />
              <label className="label-title">Tipo de animal</label>
              <input
                type="text"
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                placeholder="ex: cachorro, gato, passarinho"
              />
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
              >
                <option value="">Qual tipo de animal?</option>
                <option value="Gato">Gato</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Passarinho">Passarinho</option>
                <option value="Outros">Outros</option>
              </select>
              <label className="label-title">Raça</label>
              <input
                type="text"
                value={animalBreed}
                onChange={(e) => setAnimalBreed(e.target.value)}
                placeholder="ex: husky, vira-lata"
              />
              <label className="label-title">Idade</label>
              <input
                type="text"
                value={animalAge}
                onChange={(e) => setAnimalAge(e.target.value)}
                placeholder="ex: 1 ano, 2 anos"
              />
              <label className="label-title">Motivo da doação</label>
              <TextareaAutosize
                value={donationReason}
                onChange={(e) => setDonationReason(e.target.value)}
                minRows={3}
                maxRows={6}
                placeholder="fale sobre o motivo da doação"
              />

              <label className="label-title">Mais sobre o animal</label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Fale mais sobre o animal, coisas que acha importante outras pessoas saberem"
              />
              <label className="label-title">Telefone para contato</label>
              <input
                type="number"
                placeholder="ex: 11 999999999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <label className="label-title">Qual sexo do animal</label>
              <select value={sex} onChange={(e) => setSex(e.target.value)}>
                <option value="">Qual sexo?</option>
                <option value="Fêmea">Fêmea</option>
                <option value="Macho">Macho</option>
              </select>
              <label className="label-title">Qual tamanho do animal</label>
              <select value={size} onChange={(e) => setSize(e.target.value)}>
                <option value="">Qual tamanho?</option>
                <option value="Pequeno">Pequeno</option>
                <option value="Medio">Medio</option>
                <option value="Grande">Grande</option>
              </select>
              <label className="label-title">Local onde o animal está</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option className="option-title" value="">
                  Selecione o local
                </option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <label className="label-title">Características do animal</label>
              <div className="characteristics-container">
                {availableCharacteristics.map((characteristic, index) => (
                  <label
                    key={index}
                    className={`characteristic-label ${
                      characteristics.includes(characteristic) ? "active" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={characteristic}
                      checked={characteristics.includes(characteristic)}
                      onChange={handleCharacteristicsChange}
                      className="characteristic-checkbox"
                    />
                    {characteristic}
                  </label>
                ))}
              </div>
              <label className="label-title">Foto do animal</label>
              <input type="file" onChange={handleImageChange} />
              <Button className="button-save" type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Informações"}
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Dados;
