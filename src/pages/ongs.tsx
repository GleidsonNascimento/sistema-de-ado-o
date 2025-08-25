import Navbar from "./header";
import { ongs } from "./utilitarios/listOng";
import "./ongs.css";
import Background from "./background";

export default function Ong() {
  return (
    <Background>
      <>
        <Navbar />

        <h2 className="ong-tittle">Lista de ONGS</h2>
        <div className="box-ongCard">
          {ongs.map((ong) => (
            <div key={ong.name} className="ong-card">
              <img src={ong.img} alt={ong.name} className="ong-img" />
              <h3>{ong.name}</h3>
              <p>
                {ong.location} - {ong.state}
              </p>
              <p>
                <a href={ong.link} target="_blank" rel="noopener noreferrer">
                  Visitar
                </a>
              </p>
            </div>
          ))}
        </div>
      </>
    </Background>
  );
}
