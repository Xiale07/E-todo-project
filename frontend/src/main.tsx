import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import AllTodos from "./todos";
import Login from './login.tsx'
import Register from './register.tsx'
import Settings from './settings.tsx'
import Profil from './profil.tsx'
import User from './user.tsx'
import Users from './users.tsx'
import AllTheTodos from "./AllTodos.tsx";
import Todo from "./todo.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/user" element={<Profil />} />
  <Route path="/users" element={<Users />} />  
  <Route path="/users/:param" element={<User />} /> 
  <Route path="/user/todos" element={<AllTodos />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/todos" element={<AllTheTodos />} />
  <Route path="/todos/:param" element={<Todo />} />

</Routes>

    </BrowserRouter>
  </StrictMode>
);