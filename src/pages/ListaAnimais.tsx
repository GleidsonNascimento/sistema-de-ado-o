import { useEffect, useState } from "react";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase-auth";
import "./ListaAnimais.css";
import Navbar from "./header";
import route from "./route";
import { useNavigate } from "react-router-dom";

interface Animal {
  id: string;
  animalType: string;
  animalBreed: string;
  animalAge: string;
  ownerName: string;
  imageUrl?: string;
}

export default function ListAnimal() {
  const [allAnimals, setAllAnimals] = useState<Animal[]>([]);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchAllAnimals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ads"));
        const animals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Animal[];
        const animalsWithOwners = await Promise.all(
          animals.map(async (animal) => {
            if (!animal.userId) {
              console.error(`Animal with ID ${animal.id} has no userId`);
              return { ...animal, ownerName: "Desconhecido" };
            }
            try {
              const userDoc = await getDoc(doc(db, "users", animal.userId));
              const ownerName = userDoc.exists()
                ? userDoc.data().name
                : "Desconhecido";
              return { ...animal, ownerName };
            } catch (userError) {
              console.error(
                `Error ao procurar Id do animal ${animal.id}:`,
                userError
              );
              return { ...animal, ownerName: "Desconhecido" };
            }
          })
        );

        setAllAnimals(animalsWithOwners);
      } catch (error) {
        console.error("erro ao procurar informações do animal:", error);
      }
    };
    fetchAllAnimals();
  }, []);

  const handleAnimalClick = (id: string) => {
    navigation(`/animal/${id}`);
  };
  return (
    <div className="con-bg-list">
      <Navbar />
      <h1>Todos os animais para adoção</h1>
      <div className="con-align-list">
        {allAnimals.map((animal) => (
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
                  <span>Raça:</span>
                  {animal.animalBreed}
                </p>
                <p>
                  <span>Idade:</span> {animal.animalAge}
                </p>
                <p>
                  <span>Dono:</span>
                  {animal.ownerName}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
