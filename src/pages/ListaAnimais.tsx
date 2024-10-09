import { useEffect, useState } from "react";
import { collection, getDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./firebase-auth";
import Navbar from "./header";

export default function ListAnimal() {
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

        setAllAnimals(animalsWithOwners);
      } catch (error) {
        console.error("Error fetching animals:", error);
      }
    };

    fetchAllAnimals();
  }, []);
  return (
    <div>
      <Navbar />
      <h1>todos os animais para adoção</h1>
      {allAnimals.map((animal) => (
        <div key={animal.id}>
          {animal.imageUrl && (
            <img src={animal.imageUrl} alt={`Imagem do ${animal.animalType}`} />
          )}
          <div>
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
  );
}
