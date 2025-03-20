import { BrowserRouter, Route, Routes } from "react-router-dom";

import Imagem from "./screen";
import { Login } from "./login";
import Register from "./cadastro";
import HomePage from "./HomePage";
import ListAnimal from "./ListaAnimais";
import AnimalDetails from "./detalhes-animal";

export default function () {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cadastro" element={<Login />} />
            <Route path="/img" element={<Imagem />} />
            <Route path="/cadastrar" element={<Register />} />
            <Route path="/ListaDeAnimais" element={<ListAnimal />} />
            <Route path="/animal/:id" element={<AnimalDetails />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
