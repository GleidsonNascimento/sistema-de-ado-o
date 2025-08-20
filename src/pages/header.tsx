import { Link } from "react-router-dom";
import "./hearder.css";
import UserProfile from "./profile";
import dogPaw from "../assets/dog-paw.png";
export default function Navbar() {
  return (
    <nav className="navbar">
      <img className="img-nav" src={dogPaw} alt="" />
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>
        <Link to="/img">Minhas adoções</Link>
      </p>
      <p>
        <Link to="/ListaDeAnimais">Lista de animais</Link>
      </p>
      <p>
        <Link to="/ong">Ongs pelo pais</Link>
      </p>
      <UserProfile />
    </nav>
  );
}
