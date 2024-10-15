import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-auth";
import Navbar from "./header";

interface Animal {
  id: string;
  animalType: string;
  animalBreed: string;
  animalAge: string;
  ownerName: string;
  imageUrl?: string;
}

export default function AnimalDetails() {
  const { id } = useParams<{ id: string }>();
  const [animal, setAnimal] = useState<Animal | null>(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const docRef = doc(db, "ads", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const animalData = docSnap.data();

          if (animalData?.userId) {
            const userDoc = await getDoc(doc(db, "users", animalData.userId));
            const ownerName = userDoc.exists()
              ? userDoc.data()?.name || "Desconhecido"
              : "Desconhecido";
            setAnimal({ id: docSnap.id, ownerName, ...animalData });
          } else {
            setAnimal({
              id: docSnap.id,
              ownerName: "Desconhecido",
              ...animalData,
            });
          }
        } else {
          console.error("Animal não encontrado");
        }
      } catch (error) {
        console.error("Não foi possível encontrar os detalhes:", error);
      }
    };

    if (id) {
      fetchAnimal();
    }
  }, [id]);
  if (!animal) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="con-bg-details">
      <Navbar />
      <h1>Detalhes do {animal.animalType}</h1>
      <div className="con-list-details">
        {animal.imageUrl && (
          <img src={animal.imageUrl} alt={`Imagem do ${animal.animalType}`} />
        )}
        <div className="con-list-info">
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
        </div>
      </div>
    </div>
  );
}
