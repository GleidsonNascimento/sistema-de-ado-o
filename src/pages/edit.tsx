import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import locations from "./utilitarios/locais";
import "./modal.css";

interface EditdadosProps {
  show: boolean;
  handleClose: () => void;
  adData: {
    id: string;
    animalName: string;
    animalType: string;
    animalBreed: string;
    animalAge: string;
    donationReason: string;
    location: string;
    size: string;
    sex: string;
    caracteristics: string[];
    phone: string;
    about: string;
  };
  handleSave: (id: string, data: any) => void;
}

const Editdados: React.FC<EditdadosProps> = ({
  show,
  handleClose,
  adData,
  handleSave,
}) => {
  const [animalName, setAnimalName] = useState(adData.animalName);
  const [animalType, setAnimalType] = useState(adData.animalType);
  const [animalBreed, setAnimalBreed] = useState(adData.animalBreed);
  const [animalAge, setAnimalAge] = useState(adData.animalAge);
  const [donationReason, setDonationReason] = useState(adData.donationReason);
  const [location, setLocation] = useState(adData.location);
  const [size, setSize] = useState(adData.size);
  const [sex, setSex] = useState(adData.sex);
  const [phone, setPhone] = useState(adData.phone);
  const [characteristics, setCharacteristics] = useState<string[]>(
    adData.caracteristics || []
  );

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

  const handleCharacteristicsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCharacteristics((prev) =>
      prev.includes(value)
        ? prev.filter((char) => char !== value)
        : [...prev, value]
    );
  };

  const handleFormSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleSave(adData.id, {
      animalName,
      animalType,
      animalBreed,
      animalAge,
      donationReason,
      location,
      sex,
      size,
      characteristics,
      phone,
    });
    handleClose();
  };

  return (
    <Modal className="box-modal" show={show} onHide={handleClose}>
      <h2 className="titulo-modal">
        Edite as informações do animal que você quer colocar para adoção
      </h2>
      <button className="close" onClick={handleClose}>
        x
      </button>
      <form onSubmit={handleFormSubmit}>
        <label className="label-title">Nome do animal</label>
        <input
          type="text"
          value={animalName}
          onChange={(e) => setAnimalName(e.target.value)}
          placeholder="ex: Fido, Whiskers"
        />
        <label className="label-title">
          Tipo de animal que você quer doar{" "}
        </label>
        <input
          type="text"
          value={animalType}
          onChange={(e) => setAnimalType(e.target.value)}
          placeholder="ex cachorro, gato, passarinho"
        />
        <label className="label-title">Qual a raça do animal?</label>
        <input
          type="text"
          value={animalBreed}
          onChange={(e) => setAnimalBreed(e.target.value)}
          placeholder="ex husk, vira-lata, salsicha"
        />
        <label className="label-title">Quanto tempo de vida?</label>
        <input
          type="text"
          value={animalAge}
          onChange={(e) => setAnimalAge(e.target.value)}
          placeholder="ex 1 ano, 2 anos"
        />
        <label className="label-title">Qual tamanho do animal?</label>
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="">Qual tamanho?</option>
          <option value="Pequeno">Pequeno</option>
          <option value="Medio">Medio</option>
          <option value="Grande">Grande</option>
        </select>
        <label className="label-title">Qual sexo do animal</label>
        <select value={sex} onChange={(e) => setSex(e.target.value)}>
          <option value="">Qual sexo?</option>
          <option value="Femea">Femea</option>
          <option value="Macho">Macho</option>
        </select>
        <label className="label-title">Telefone para contato</label>
        <input
          type="number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="ex 11999999999"
        />
        <label className="label-title">Local onde o animal está</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">selecione o local</option>
          {locations.map((loc, index) => (
            <option key={index} value={loc}>
              {loc}
            </option>
          ))}
          <div className="characteristics-container">
            {availableCharacteristics.map((char, index) => (
              <label
                key={index}
                className={`characteristic-label ${
                  characteristics.includes(char) ? "active" : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={char}
                  checked={characteristics.includes(char)}
                  onChange={handleCharacteristicsChange}
                  className="characteristic-checkbox"
                />
                {char}
              </label>
            ))}
          </div>
        </select>
        <div className="characteristics-container">
          {availableCharacteristics.map((char, index) => (
            <label
              key={index}
              className={`characteristic-label ${
                characteristics.includes(char) ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                value={char}
                checked={characteristics.includes(char)}
                onChange={handleCharacteristicsChange}
                className="characteristic-checkbox"
              />
              {char}
            </label>
          ))}
        </div>
        <label className="label-title">Motivo pelo qual estou doando?</label>
        <input
          type="text"
          value={donationReason}
          onChange={(e) => setDonationReason(e.target.value)}
          placeholder="ex: na minha casa não tem espaço para o filhote"
        />
        <button className="button-save" type="submit">
          salvar informações
        </button>
      </form>
    </Modal>
  );
};

export default Editdados;
