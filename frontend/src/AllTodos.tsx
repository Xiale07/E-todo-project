import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Burger";

type Priority = "Urgent" | "Average" | "Down";
type Status = "Not started" | "To do" | "In progress" | "Finished";

interface TodoType {
    id: number;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    created_at: string;
    user_id: number;
}

function AllTodos() {
    const [todos, setTodos] = useState<TodoType[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
        }
    }, []);

    useEffect(() => {
        const fetchTodos = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/todos", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    navigate("/login");
                    return;
                }

                const data = await res.json();
                setTodos(data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTodos();
    }, [navigate]);

    if (loading)
        return <div className="w-full text-center mt-10 text-xl">Chargement...</div>;

    return (
        <div className="w-full flex flex-wrap justify-center gap-10">
            <NavBar />


                 {/* Affichage simplifier des todos */}


            <div className="w-3/4 bg-base-300 p-6 rounded-2xl mt-10">
                <h2 className="text-2xl font-bold mb-5">Liste de toutes les Todos</h2>


                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Titre</th>
                            <th>Utilisateur (ID)</th>
                            <th>Action</th>      {/* Bouton pour acceder a la description de la todo */}
                        </tr>
                    </thead>

                    <tbody>
                        {todos.map((t) => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.title}</td>
                                <td>User #{t.user_id}</td>
                                <td>  {/* Bouton pour acceder a la description de la todo */}
                                    <button            
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/todos/${t.id}`)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default AllTodos;
