import { useParams } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-auth";
import Navbar from "./header";
import local from "../assets/location.png";
import user from "../assets/user.png";
import donation from "../assets/doação.png";
import { capitalizeWord } from "./utilitarios/capslock";
import "./animal.css";

interface Animal {
  imageUrl: string | undefined;
  ownerName: ReactNode;
  id: string;
  animalName: string;
  animalType: string;
  animalBreed: string;
  animalAge: string;
  donationReason: string;
  location: string;
  characteristics: string[];
  size: string;
  sex: string;
  phone: string;
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
            setAnimal({
              id: docSnap.id,
              ownerName,
              imageUrl: animalData.imageUrl,
              animalName: animalData.animalName,
              animalType: animalData.animalType,
              animalBreed: animalData.animalBreed,
              animalAge: animalData.animalAge,
              donationReason: animalData.donationReason,
              location: animalData.location,
              characteristics: animalData.characteristics,
              size: animalData.size,
              sex: animalData.sex,
              phone: animalData.phone,
            });
          } else {
            setAnimal({
              id: docSnap.id,
              ownerName: "Desconhecido",
              imageUrl: animalData.imageUrl,
              animalName: animalData.animalName,
              animalType: animalData.animalType,
              animalBreed: animalData.animalBreed,
              animalAge: animalData.animalAge,
              donationReason: animalData.donationReason,
              location: animalData.location,
              characteristics: animalData.characteristics,
              size: animalData.size,
              sex: animalData.sex,
              phone: animalData.phone,
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
      <h1>Detalhes sobre </h1>
      <div className="con-list-details">
        <div className="con-animal-img">
          {animal.imageUrl && (
            <img
              className="animal-img"
              src={animal.imageUrl}
              alt={`Imagem do ${animal.animalType}`}
            />
          )}
        </div>
        <div className="con-details-info">
          <p className="name-animal-info">
            {capitalizeWord(animal.animalName)}
          </p>
          <div className="group-infos-1">
            <p>{capitalizeWord(animal.animalType)} | </p>
            <p>{animal.sex} | </p>
            <p>{animal.size} | </p>
            <p>{animal.animalAge} </p>
          </div>
          <div className="group-infos-2">
            <p>
              <img
                className="details-icon"
                src={local}
                alt="localização do gato"
              />{" "}
              Está em {animal.location}
            </p>
            <p>
              {" "}
              <img src={user} alt="dono o gato" /> O dono do gato é{" "}
              {animal.ownerName}
            </p>
            <p>
              <img src={donation} alt="motivo da doação" /> Razão da doação:
              {animal.donationReason}
            </p>
          </div>
          <button
            className="contact-button"
            onClick={() => {
              if (!animal.phone) {
                alert("Número de contato não disponível.");
                return;
              }
              const phoneNumber = animal.phone.replace(/\D/g, "");
              const message = encodeURIComponent(
                `Olá, estou interessado em adotar ${animal.animalName}. Poderia me dar mais informações?`
              );
              window.open(
                `https://wa.me/${phoneNumber}?text=${message}`,
                "_blank"
              );
            }}
          >
            Entrar em contato
          </button>
          <div className="group-infos-3">
            <h3>Um pouco mais de {capitalizeWord(animal.animalName)}</h3>
            <p>
              Filho é um gato super alegre, carinhoso e cheio de energia! Ele
              adora brincar, correr atrás de bolinhas e se aconchegar no colo
              para receber carinho. Sempre pronto para um momento de diversão ou
              um cochilo tranquilo, ele vai encher sua casa de alegria e amor.
              Se você procura um companheiro fiel e brincalhão, Filho é a
              escolha perfeita! 🏡🐾
            </p>
            <span>Raça:</span> {animal.animalBreed}
            <div>
              <h3>caracteristicas do animal</h3>
              {animal.characteristics && animal.characteristics.length > 0 ? (
                <div className="animal-carater">
                  {animal.characteristics.map((char) => (
                    <p className="carateristicas" key={char}>
                      {char}
                    </p>
                  ))}
                </div>
              ) : (
                <p> este animal não tem caracteristicas </p>
              )}
            </div>
            <p></p>
          </div>
          <button
            className="contact-button"
            onClick={() => {
              if (!animal.phone) {
                alert("Número de contato não disponível.");
                return;
              }
              const phoneNumber = animal.phone.replace(/\D/g, "");
              const message = encodeURIComponent(
                `Olá, estou interessado em adotar ${animal.animalName}. Poderia me dar mais informações?`
              );
              window.open(
                `https://wa.me/${phoneNumber}?text=${message}`,
                "_blank"
              );
            }}
          >
            Quero adotar
          </button>
        </div>
      </div>
    </div>
  );
}
