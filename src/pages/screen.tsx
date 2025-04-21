import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase-auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Dados from "./Modal-de-adicionar";
import Editdados from "./edit";
import "./screen.css";
import Navbar from "./header";
import { capitalizeWord } from "./utilitarios/capslock";

interface Ad {
  id: string;
  animalName: string;
  animalType: string;
  animalBreed: string;
  animalAge: string;
  donationReason: string;
  imageUrl?: string;
  location?: string;
  size?: string;
  sex?: string;
  caracteristics?: string[];
  phone?: string;
  about?: string;
}

const fetchUserAds = async (userId: string) => {
  const userDoc = await getDoc(doc(db, "users", userId));
  if (!userDoc.exists()) throw new Error("Usuário não encontrado");

  const userData = userDoc.data();
  const adsQuery = query(collection(db, "ads"), where("userId", "==", userId));
  const adsSnapshot = await getDocs(adsQuery);

  return {
    userName: userData.name,
    imageUrl: userData.profilePic,
    ads: adsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Ad[],
  };
};

const Imagem = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [editingAd, setEditingAd] = useState<string | null>(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["userAds", userId],
    queryFn: () =>
      userId ? fetchUserAds(userId) : Promise.reject("Sem usuário"),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  const deleteMutation = useMutation({
    mutationFn: async (adId: string) => {
      await deleteDoc(doc(db, "ads", adId));
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["userAds", userId] });
      }
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({
      adId,
      updatedData,
    }: {
      adId: string;
      updatedData: Partial<Ad>;
    }) => {
      await updateDoc(doc(db, "ads", adId), updatedData);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["userAds", userId] });
      }
      setEditingAd(null);
    },
  });

  const toggleModal = () => setShow(!show);
  const closeEditModal = () => setEditingAd(null);

  if (isLoading) return <p>Carregando anúncios...</p>;
  if (isError) return <p>Erro ao carregar os anúncios. Tente novamente.</p>;

  return (
    <div className="con-profile">
      <Navbar />
      <div className="box-box">
        <Button
          className="button-addition"
          variant="primary"
          onClick={toggleModal}
        >
          +
        </Button>
        {data?.ads.map((ad) => (
          <div key={ad.id} className="box-dados">
            <h3>Informações do Animal:</h3>
            {ad.imageUrl ? (
              <img
                src={ad.imageUrl}
                alt="Imagem do animal"
                style={{ width: "250px", height: "200px" }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "default-image-url";
                }}
              />
            ) : (
              <p>Imagem não disponível</p>
            )}
            <div className="container-info">
              <p>Nome: {capitalizeWord(ad.animalName)}</p>
              <p>Tipo: {capitalizeWord(ad.animalType)}</p>
              <p>Raça: {capitalizeWord(ad.animalBreed)}</p>
              <p>Idade: {ad.animalAge}</p>
              <p>Motivo da doação: {capitalizeWord(ad.donationReason)}</p>
            </div>
            <div className="button-container">
              <button
                className="button-dados"
                onClick={() => setEditingAd(ad.id)}
              >
                Editar
              </button>
              <button
                className="button-dados"
                onClick={() => deleteMutation.mutate(ad.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
      {(show || editingAd) && (
        <div
          className="modal-overlay"
          onClick={editingAd ? closeEditModal : toggleModal}
        ></div>
      )}
      <Dados show={show} handleClose={toggleModal} />
      {editingAd && (
        <Editdados
          show={true}
          handleClose={closeEditModal}
          adData={
            data?.ads.find((ad) => ad.id === editingAd)
              ? {
                  id: data.ads.find((ad) => ad.id === editingAd)?.id || "",
                  animalName:
                    data.ads.find((ad) => ad.id === editingAd)?.animalName ||
                    "",
                  animalType:
                    data.ads.find((ad) => ad.id === editingAd)?.animalType ||
                    "",
                  animalBreed:
                    data.ads.find((ad) => ad.id === editingAd)?.animalBreed ||
                    "",
                  animalAge:
                    data.ads.find((ad) => ad.id === editingAd)?.animalAge || "",
                  donationReason:
                    data.ads.find((ad) => ad.id === editingAd)
                      ?.donationReason || "",
                  location:
                    data.ads.find((ad) => ad.id === editingAd)?.location || "",
                  size: data.ads.find((ad) => ad.id === editingAd)?.size || "",
                  sex: data.ads.find((ad) => ad.id === editingAd)?.sex || "",
                  caracteristics:
                    data.ads.find((ad) => ad.id === editingAd)
                      ?.caracteristics || [],
                  phone:
                    data.ads.find((ad) => ad.id === editingAd)?.phone || "",
                  about:
                    data.ads.find((ad) => ad.id === editingAd)?.about || "",
                }
              : {
                  id: "",
                  animalName: "",
                  animalType: "",
                  animalBreed: "",
                  animalAge: "",
                  donationReason: "",
                  location: "",
                  size: "",
                  sex: "",
                  caracteristics: [],
                  phone: "",
                  about: "",
                }
          }
          handleSave={(adId, updatedData) =>
            editMutation.mutate({ adId, updatedData })
          }
        />
      )}
    </div>
  );
};

export default Imagem;
