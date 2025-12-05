import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Burger";

interface UserType {
    id: number;
    firstname: string;
    name: string;
    email: string;
    birthdate: string;
}

function Profil() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          document.documentElement.setAttribute("data-theme", savedTheme);
        }
      }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/user", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    navigate("/login");
                    return;
                }

                const data = await res.json();
                setUser(data);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) return <div>Chargement...</div>;

    if (!user) return <div>Aucun utilisateur trouvé</div>;

    return (
        <div className="w-full flex flex-wrap justify-center gap-10">
            <NavBar />
            <div className="w-3/4 bg-base-300 p-6 rounded-2xl mt-10">
                <h2 className="text-xl font-bold mb-4">Mon Profil</h2>
                <p>Nom : {user.name}</p>
                <p>Prénom : {user.firstname}</p>
                <p>Email : {user.email}</p>
                <p>
                    <strong>Date de naissance :</strong>{" "}
                    {new Date(user.birthdate).toLocaleDateString("fr-FR")}
                </p>
            </div>
        </div>
    );
}

export default Profil;
