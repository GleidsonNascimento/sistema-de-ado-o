import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  collection,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { app } from "./firebase-auth";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const handleRegister = async () => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const handleRegister = async () => {
        const auth = getAuth(app);
        const db = getFirestore(app);

        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const userId = userCredential.user.uid;

          // Armazene o userId no sessionStorage após o registro bem-sucedido
          sessionStorage.setItem("userId", userId);

          await setDoc(doc(db, "users", userId), {
            userId,
            name,
          });

          // Redireciona para a página após o login
          history("/img");
        } catch (error) {
          console.error("Erro no registro", error.message);
        }
      };
      const userId = userCredential.user.uid;

      // Armazene o userId no sessionStorage após o registro bem-sucedido
      sessionStorage.setItem("userId", userId);

      await setDoc(doc(db, "users", userId), {
        userId,
        name,
      });

      // Redireciona para a página após o login
      history("/img");
    } catch (error) {
      console.error("Erro no registro", error.message);
    }
  };
  return (
    <div>
      <h2>Register</h2>
      <label>nome:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Passowrd </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Registrar</button>
      <p>
        já tem <Link to="/">conta?</Link>
      </p>
    </div>
  );
};

export default Register;
