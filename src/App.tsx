/* eslint-disable @typescript-eslint/no-unused-vars */
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./page/login";
import Register from "./page/register";
import Evento from "./page/evento";
import Create from "./page/create";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/evento" element={<Evento />} />
      <Route path="/create" element={<Create />} />
    </Routes>
  );
}

export default App;