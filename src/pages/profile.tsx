import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, imagemDb } from "./firebase-auth";
import { Link } from "react-router-dom";
import "./profile.css";

const UserProfile = () => {
  const [user, setUser] = useState<{ uid: string } | null>(null);
  const [userName, setUserName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const hiddenFileInput = useRef<HTMLInputElement | null>(null);

  // Ref para marcar se perfil já foi carregado da primeira vez
  const profileLoaded = useRef(false);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      sessionStorage.clear();
      setUser(null);
      setUserName("");
      setImageUrl("");
      profileLoaded.current = false; // reset
      window.location.href = "/";
    } catch (error) {
      console.log("Erro ao fazer logout:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Checa se já tem imagem em sessionStorage
        const cachedImage = sessionStorage.getItem(
          `profilePic_${currentUser.uid}`
        );
        const cachedName = sessionStorage.getItem(
          `userName_${currentUser.uid}`
        );

        if (cachedImage && cachedName) {
          setImageUrl(cachedImage);
          setUserName(cachedName);
          profileLoaded.current = true;
        } else if (!profileLoaded.current) {
          const userRef = doc(db, "users", currentUser.uid);
          try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const name = userDoc.data().name;
              const pic = userDoc.data().profilePic;
              setUserName(name);
              setImageUrl(pic);
              sessionStorage.setItem(`profilePic_${currentUser.uid}`, pic);
              sessionStorage.setItem(`userName_${currentUser.uid}`, name);
              profileLoaded.current = true;
            }
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
          }
        }
      } else {
        setUser(null);
        setUserName("");
        setImageUrl("");
        profileLoaded.current = false;
      }
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => hiddenFileInput.current?.click();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      handleUpload(files[0]);
    }
  };

  const handleUpload = async (
    file: Blob | ArrayBuffer | Uint8Array<ArrayBufferLike>
  ) => {
    if (!user) return;

    try {
      const storageRef = ref(imagemDb, `profilePics/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => console.error("Erro no upload:", error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageUrl(downloadURL);
          sessionStorage.setItem(`profilePic_${user.uid}`, downloadURL);

          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { profilePic: downloadURL });
        }
      );
    } catch (error) {
      console.error("Erro no upload da imagem:", error);
    }
  };

  return (
    <div className="profile-box">
      {user ? (
        <>
          {imageUrl ? (
            <img
              className="profile-pic"
              src={imageUrl}
              alt="Imagem de perfil"
              onClick={handleClick}
            />
          ) : (
            <div className="profile-placeholder" onClick={handleClick}>
              <h4>Selecione uma imagem</h4>
            </div>
          )}
          <input
            type="file"
            ref={hiddenFileInput}
            onChange={handleChange}
            style={{ display: "none" }}
          />
          <div className="profile-info">
            <h3 className="profile-name">Olá, {userName || "Usuário"}!</h3>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </>
      ) : (
        <div className="profile-info">
          <p>
            <Link to="/login">Faça o login</Link>
          </p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
