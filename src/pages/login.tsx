import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { app } from "./firebase-auth";
import "./login.css";
import Background from "./background";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useNavigate();

  const handleLogin = async () => {
    const auth = getAuth(app);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      sessionStorage.setItem("userId", userId);

      history("/img");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro no login", error.message);
      } else {
        console.error("Erro no login", error);
      }
    }
  };

  return (
    <Background>
      <div className="background-login">
        <div className="con-login">
          <h2>Login</h2>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Logar</button>
          <p>
            Não tem conta? <Link to="/cadastrar">Registre-se</Link>
          </p>
        </div>
      </div>
    </Background>
  );
};

export { Login };
