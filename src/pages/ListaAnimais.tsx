import { useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase-auth";
import "./ListaAnimais.css";
import Navbar from "./header";
import locations from "./utilitarios/locais";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Background from "./background";

interface Animal {
  userId: string;
  id: string;
  animalType: string;
  animalBreed: string;
  animalAge: string;
  size?: string;
  ownerName: string;
  location?: string;
  imageUrl?: string;
  phone?: string;
}

const sizes = ["Pequeno", "Medio", "Grande"];

export default function ListAnimal() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const navigation = useNavigate();

  const fetchAnimals = async () => {
    const querySnapshot = await getDocs(collection(db, "ads"));
    const animals = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Animal[];

    const animalsWithOwners = await Promise.all(
      animals.map(async (animal) => {
        if (!animal.userId) return { ...animal, ownerName: "Desconhecido" };

        try {
          const userDoc = await getDoc(doc(db, "users", animal.userId));
          const ownerName = userDoc.exists()
            ? userDoc.data().name
            : "Desconhecido";
          return {
            ...animal,
            ownerName,
            location: animal.location || "Não informado",
            size: animal.size || "Não informado",
          };
        } catch {
          return { ...animal, ownerName: "Desconhecido" };
        }
      })
    );

    return animalsWithOwners;
  };

  const {
    data: allAnimals = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["all-animals"],
    queryFn: fetchAnimals,
    staleTime: 1000 * 60 * 5,
  });

  const filteredAnimals = allAnimals
    .filter((animal) =>
      selectedLocation ? animal.location?.includes(selectedLocation) : true
    )
    .filter((animal) =>
      selectedSize ? animal.size?.includes(selectedSize) : true
    );

  const handleAnimalClick = (id: string) => {
    navigation(`/animal/${id}`);
  };

  return (
    <Background>
      <div>
        <Navbar />
        <h1>Todos os animais para adoção</h1>

        <div className="filter-container">
          <label htmlFor="location-select">Localização</label>
          <select
            id="location-select"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">Todas as localizações</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>

          <label htmlFor="size-select">Tamanho:</label>
          <select
            id="size-select"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Todos os tamanhos</option>
            {sizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <p>Carregando animais...</p>}
        {isError && <p>Erro ao carregar os animais. Tente novamente.</p>}

        <div className="con-align-list">
          {filteredAnimals.map((animal) => (
            <div
              className="con-list"
              key={animal.id}
              onClick={() => handleAnimalClick(animal.id)}
            >
              {animal.imageUrl && (
                <img
                  src={animal.imageUrl}
                  alt={`Imagem do ${animal.animalType}`}
                />
              )}
              <div className="con-list-info">
                <dl>
                  <div className="animal-text">
                    <dt>Nome:</dt>
                    <dd>{animal.animalType}</dd>
                  </div>
                  <div className="animal-text">
                    <dt>Raça:</dt>
                    <dd>{animal.animalBreed}</dd>
                  </div>
                  <div className="animal-text">
                    <dt>Idade:</dt>
                    <dd>{animal.animalAge}</dd>
                  </div>
                  <div className="animal-text">
                    <dt>Dono:</dt>
                    <dd>{animal.ownerName}</dd>
                  </div>
                  <div className="animal-text">
                    <dt>Localização:</dt>
                    <dd>{animal.location}</dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Background>
  );
}
