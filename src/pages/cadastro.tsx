import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { app } from "./firebase-auth";

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
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Registro</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Nome
      </label>
      <input
        id="name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md mb-3"
      />

      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md mb-3"
      />

      <label
        htmlFor="password"
        className="block text-sm font-medium text-gray-700"
      >
        Senha
      </label>
      <input
        id="password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-md mb-4"
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
  );
};

export default Register;
