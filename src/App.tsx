import { useState } from "react";
import "./App.css";
import Route from "./pages/route";
import { UserProvider } from "./pages/UserContext";

function App() {
  return (
    <>
      <UserProvider>
        <Route />
      </UserProvider>
    </>
  );
}

export default App;
