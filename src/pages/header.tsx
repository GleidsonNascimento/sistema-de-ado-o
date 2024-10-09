import { Link } from "react-router-dom";
import "./hearder.css";
import UserProfile from "./profile";
export default function Navbar() {
  return (
    <nav className="navbar">
      <img
        className="img-nav"
        src={`https://www.pngitem.com/pimgs/m/69-693818_pata-de-cachorro-vetor-hd-png-download.png`}
        alt=""
      />
      <p>
        <Link to="/">Home</Link>
      </p>
      <p>
        <Link to="/img">Minhas adoções</Link>
      </p>
      <p>
        {" "}
        <Link to="ListaDeAnimais">Lista de animais</Link>
      </p>
      <UserProfile />
    </nav>
  );
}
