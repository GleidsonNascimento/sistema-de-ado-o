import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { db } from "./firebase-auth";
import "./HomePage.css";
import Navbar from "./header";
import Banner from "./banner";
import catImg from "../assets/cat.png";
import dogImg from "../assets/dog.png";
import defaultImg from "../assets/animal.png";

interface Animal {
  id: string;
  animalName: string;
  animalBreed: string;
  animalAge: number;
  animalType: string;
  imageUrl?: string;
  ownerName?: string;
  userId?: string;
}

const getAnimalRepresentationImage = (animal: Animal) => {
  switch (animal.animalType) {
    case "Gato":
      return catImg;
    case "Cachorro":
      return dogImg;
    default:
      return defaultImg;
  }
};

const fetchAllAnimals = async (): Promise<Animal[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "ads"));
    const animals = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Animal[];

    const animalsWithOwners = await Promise.all(
      animals.map(async (animal) => {
        if (!animal.userId) {
          return { ...animal, ownerName: "Desconhecido" };
        }
        try {
          const userDoc = await getDoc(doc(db, "users", animal.userId));
          const ownerName = userDoc.exists()
            ? userDoc.data().name
            : "Desconhecido";
          return { ...animal, ownerName };
        } catch {
          return { ...animal, ownerName: "Desconhecido" };
        }
      })
    );
    return animalsWithOwners.slice(-4).reverse();
  } catch (error) {
    console.error("Erro ao buscar animais:", error);
    return [];
  }
};

const HomePage = () => {
  const {
    data: allAnimals = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["animals"],
    queryFn: fetchAllAnimals,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar os animais.</p>;

  return (
    <div className="bg-home">
      <Navbar />
      <Banner />
      <h1 className="listAnimal-h1">Acabaram de ser cadastrados</h1>
      <div className="box-animalCard">
        {allAnimals.map((animal) => (
          <div key={animal.id} className="animal-card">
            {animal.imageUrl && (
              <img
                src={animal.imageUrl}
                alt={`Imagem do ${animal.animalType}`}
              />
            )}
            <div className="home-animal-info">
              <div className="animal-p">
                <p>
                  <span>Nome:</span> {animal.animalName}
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
                <img
                  src={getAnimalRepresentationImage(animal)}
                  alt={`Representação de um ${animal.animalType}`}
                  className="animal-representation-image"
                />
              </div>
            </div>
          </div>
        ))}
        <button className="button-list-animal">
          <Link to="/ListaDeAnimais" className="no-underline">
            Para olhar a lista completa de animais para adoção
          </Link>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
