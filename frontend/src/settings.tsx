import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Burger.tsx";

const themes = [
  "night", "luxury", "aqua", "black", "cupcake", "forest", "synthwave",
  "business", "lofi", "dracula", "cyberpunk", "valentine", "halloween",
  "garden", "retro", "pastel", "fantasy", "wireframe", "emerald",
  "corporate", "acid", "autumn", "winter", "bumblebee",
  "coffee", "dark", "light", "lemonade"
];

function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("night");
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    firstname: "",
    name: "",
    email: "",
    birthdate: "",
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const handleThemeChange = (e: { target: { value: any; }; }) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    if (!token) return navigate("/login");

    fetch("http://localhost:3000/user", {
      headers: { Authorization: "Bearer " + token },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({
          firstname: data.firstname,
          name: data.name,
          email: data.email,
          birthdate: data.birthdate?.split("T")[0] || "",
        });
      })
      .catch(() => navigate("/login"));
  }, []);

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) return;

    const res = await fetch(`http://localhost:3000/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message || "Profil mis à jour");
  };

  const handleDelete = async () => {
    if (!confirm("Es-tu sûr de vouloir supprimer ton compte ?")) return;
    if (!user) return;

    await fetch(`http://backend:3000/users/${user.id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-full flex flex-wrap justify-center gap-10">
      <NavBar />

      <div className="w-3/5 flex flex-col gap-4 my-15 bg-base-200 p-5 rounded-2xl">
        <div className="gap-8 flex flex-col">

          <div className="flex flex-wrap gap-4">
            <select className="select" value={theme} onChange={handleThemeChange}>
              {themes.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-base-300 rounded-2xl p-5 flex flex-col gap-4">
            <div>
              Nom
              <input
                className="input w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div>
              Prénom
              <input
                className="input w-full"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                type="text"
              />
            </div>

            <div>
              Email
              <input
                className="input w-full"
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
              />
            </div>

            <div>
              Date de naissance
              <input
                className="input w-full"
                name="birthdate"
                value={form.birthdate}
                onChange={handleChange}
                type="date"
              />
            </div>

            <button className="btn btn-primary" onClick={handleSave}>
              Sauvegarder
            </button>
          </div>

          <button className="btn btn-warning btn-sm" onClick={handleLogout}>
            Déconnexion
          </button>

          <button className="btn btn-error btn-sm" onClick={handleDelete}>
            Supprimer le compte
          </button>

          <button className="btn btn-accent" onClick={() => navigate("/user/todos")}>
            Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;