import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./Burger";

interface UserType {
    id: number;
    firstname: string;
    name: string;
    email: string;
    birthdate: string;
}

function User() {
    const { param } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState<UserType | null>(null);
    const [editedUser, setEditedUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          document.documentElement.setAttribute("data-theme", savedTheme);
        }
      }, []);
  
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate("/login");

        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:3000/users/${param}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (!res.ok) {
                    setError("Utilisateur introuvable");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setUser(data);
                setEditedUser(data);

            } catch (err) {
                console.error(err);
                setError("Erreur serveur");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [param, navigate]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editedUser) return;
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

 
    const handleSave = async () => {
        if (!editedUser) return;

        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/users/${editedUser.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: editedUser.name,
                firstname: editedUser.firstname,
                email: editedUser.email,
            }),
        });

        if (!res.ok) return alert("Erreur lors de la sauvegarde");

        alert("Modifications enregistrées !");
    };


    const handleDelete = async () => {
        if (!user) return;

        if (!confirm("Supprimer ce compte ?")) return;

        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/users/${user.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) return alert("Erreur lors de la suppression");

        alert("Compte supprimé !");
        navigate("/users");
    };


    if (loading) return <div className="text-center mt-20">Chargement...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
    if (!editedUser) return null;

    return (
        <div className="w-full flex flex-wrap justify-center gap-10">
            <NavBar />
            <div className="w-2/3 bg-base-300 p-5 rounded-xl mt-10">

                <h2 className="text-2xl font-bold mb-4">
                    Profil de {editedUser.name} {editedUser.firstname}
                </h2>

       
                <div className="flex flex-col gap-3">

                    <label>
                        Nom :
                        <input
                            name="name"
                            value={editedUser.name}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </label>

                    <label>
                        Prénom :
                        <input
                            name="firstname"
                            value={editedUser.firstname}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </label>

                    <label>
                        Email :
                        <input
                            name="email"
                            value={editedUser.email}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </label>

                    <p><strong>Date de naissance :</strong>{" "}
                        {new Date(editedUser.birthdate).toLocaleDateString("fr-FR")}
                    </p>

                    <button className="btn btn-primary mt-3" onClick={handleSave}>
                        Sauvegarder
                    </button>
                </div>

 
                <div className="mt-6 flex gap-4">
                    <button className="btn btn-accent" onClick={() => navigate("/users")}>
                        Retour à la liste
                    </button>

                    <button className="btn btn-error" onClick={handleDelete}>
                        Supprimer le compte
                    </button>

                    <button className="btn btn-info" onClick={() => navigate("/todos")}>
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default User;
