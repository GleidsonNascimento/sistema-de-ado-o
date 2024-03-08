import { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app, db, imagemDb } from "./firebase-auth";
import { Button } from "react-bootstrap";
import "./screen.css";
import Dados from "./info-adoção";

const Imagem = () => {
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [animalInfo, setAnimalInfo] = useState({});
  const hiddenFileInput = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlelogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("erro ao fazer logout");
    }
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    setProfilePic(file);
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    const userId = sessionStorage.getItem("userId");
    const storageRef = ref(imagemDb, "profilePics/" + userId);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.error("Erro no upload da imagem", error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          const userRef = doc(db, "users", userId);
          updateDoc(userRef, { profilePic: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");

      if (userId) {
        const userDoc = await getDoc(doc(db, "users", userId));

        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
          setImageUrl(userDoc.data().profilePic);
          setAnimalInfo({
            animalType: userDoc.data().animalType,
            animalBreed: userDoc.data().animalBreed,
            animalAge: userDoc.data().animalAge,
            donationReason: userDoc.data().donationReason,
          });
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div>
      <div className="profile-box">
        {imageUrl && (
          <img
            className="profile-pic"
            src={imageUrl}
            alt="Imagem de perfil"
            onClick={handleClick}
          />
        )}
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          style={{ display: "none" }}
        />
        <h3 className="profile-name">{userName || "Usuário"}!</h3>
      </div>

      {animalInfo.animalType && (
        <div>
          <h3>Informações do Animal:</h3>
          <p>Tipo: {animalInfo.animalType}</p>
          <p>Raça: {animalInfo.animalBreed}</p>
          <p>Idade: {animalInfo.animalAge}</p>
          <p>Motivo da doação: {animalInfo.donationReason}</p>
        </div>
      )}
      <Button variant="primary" onClick={handleShow}>
        Abrir Modal
      </Button>
      <Button variant="danger" onClick={handlelogout}>
        Logout
      </Button>

      <Dados show={show} handleClose={handleClose} />
    </div>
  );
};

export default Imagem;
