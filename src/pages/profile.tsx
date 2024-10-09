import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, imagemDb } from "./firebase-auth";
import "./profile.css";

const UserProfile = () => {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const hiddenFileInput = useRef(null);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userRef = doc(db, "users", userId);

        getDoc(userRef).then((userDoc) => {
          if (userDoc.exists()) {
            setUserName(userDoc.data().name);
            setImageUrl(userDoc.data().profilePic);
          }
        });
      } else {
        setUserName("");
        setImageUrl("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
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
        <div className="profile-info">
          {imageUrl ? (
            <>
              <h3 className="profile-name">Olá, {userName}!</h3>
              <Button
                className="btn-logout"
                variant="danger"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <p>
              <Link to="/cadastro">Faça o login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
