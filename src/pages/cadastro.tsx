import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { app } from "./firebase-auth";
import Background from "./background";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    const auth = getAuth(app);
    const db = getFirestore(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const userId = userCredential.user.uid;

      sessionStorage.setItem("userId", userId);

      await setDoc(doc(db, "users", userId), {
        userId,
        name: formData.name,
        email: formData.email,
      });

      navigate("/img");
    } catch (error: any) {
      setError(error.message || "Erro ao registrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <div className="background-login">
        {error && <p>{error}</p>}

        <div className="con-login">
          <h2>Registro</h2>
          <label htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />

          <button
            onClick={handleRegister}
            className={`w-full bg-blue-500 text-white py-2 rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <p className="mt-4 text-center text-sm">
            Já tem uma conta?{" "}
            <Link to="/" className="text-blue-500">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </Background>
  );
};

export default Register;
