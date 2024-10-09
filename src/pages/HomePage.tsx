import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-auth";
import "./HomePage.css";
import Navbar from "./header";
import Banner from "./banner";

const HomePage = () => {
  const [allAnimals, setAllAnimals] = useState([]);

  useEffect(() => {
    const fetchAllAnimals = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ads"));
        const animals = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
                `Error fetching user for animal ID ${animal.id}:`,
                userError
              );
              return { ...animal, ownerName: "Desconhecido" };
            }
          })
        );

        const latestAnimal = animalsWithOwners.slice(-4).reverse();

        setAllAnimals(latestAnimal);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAllAnimals();
  }, []);

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
            <div className="animal-info">
              <div className="animal-p">
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
        <button className="button-list-animal">
          Para olhar a lista completa de animais para adoção
        </button>
      </div>
    </div>
  );
};

export default HomePage;
