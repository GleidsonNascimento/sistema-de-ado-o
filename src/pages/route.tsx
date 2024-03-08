import { BrowserRouter, Route, Routes } from "react-router-dom";
import Imagem from "./screen";
import { Login } from "./login";
import Register from "./cadastro";

export default function () {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/img" element={<Imagem />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}
