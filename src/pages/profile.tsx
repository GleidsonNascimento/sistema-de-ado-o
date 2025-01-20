import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import { Button } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, imagemDb } from "./firebase-auth";
import "./profile.css";

const UserProfile: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const hiddenFileInput = useRef<HTMLInputElement>(null);

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

    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setIsAuthenticated(true);
        console.log("Usuário autenticado:", user.uid);
        const userRef = doc(db, "users", user.uid);
        try {
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserName(data?.name || "Usuário");
            setImageUrl(data?.profilePic || null);
          } else {
            console.warn("Documento do usuário não encontrado no Firestore.");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário no Firestore:", error);
        }
      } else {
        setIsAuthenticated(false);
        console.log("Nenhum usuário autenticado.");
        setUserName(null);
        setImageUrl(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("Usuário não autenticado.");
      return;
    }

    const userId = currentUser.uid;
    const storageRef = ref(imagemDb, `profilePics/${userId}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Progresso do upload: ${progress}%`);
      },
      (error) => {
        console.error("Erro no upload da imagem:", error.message);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);

          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, { profilePic: downloadURL });
          console.log("URL da imagem atualizada no Firestore.");
        } catch (error) {
          console.error("Erro ao salvar URL da imagem no Firestore:", error);
        }
      }
    );
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className="profile-box">
          {imageUrl ? (
            <img
              className="profile-pic"
              src={imageUrl}
              alt="Imagem de perfil"
              onClick={handleClick}
            />
          ) : (
            <div className="placeholder-pic" onClick={handleClick}>
              Adicionar Foto
            </div>
          )}
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            className="hidden-input"
          />
          <div className="profile-info">
            {userName ? (
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
      ) : (
        <p className="not-logged-in">
          <Link to="/cadastro">Faça login</Link>
        </p>
      )}
    </div>
  );
};

export default UserProfile;
