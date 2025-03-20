import { useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "./firebase-auth";
import "./ListaAnimais.css";
import Navbar from "./header";
import locations from "./utilitarios/locais";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

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
    queryKey: ["animals"],
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
    <div className="con-bg-list">
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
              <div>
                <p>
                  <span>Nome:</span> {animal.animalType}
                </p>
                <p>
                  <span>Raça:</span> {animal.animalBreed}
                </p>
                <p>
                  <span>Idade:</span> {animal.animalAge}
                </p>
                <p>
                  <span>Dono:</span> {animal.ownerName}
                </p>
                <p>
                  <span>Localização:</span> {animal.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
