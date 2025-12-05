import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

function Todo() {
    const { param } = useParams();
    const navigate = useNavigate();

    const [todo, setTodo] = useState<TodoType | null>(null);
    const [editedTodo, setEditedTodo] = useState<TodoType | null>(null);
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

        const fetchTodo = async () => {
            try {
                const res = await fetch(`http://localhost:3000/todos/${param}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    setError("Todo introuvable");
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setTodo(data);
                setEditedTodo(data);

            } catch (err) {
                console.error(err);
                setError("Erreur serveur");
            } finally {
                setLoading(false);
            }
        };

        fetchTodo();
    }, [param, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!editedTodo) return;

        setEditedTodo({
            ...editedTodo,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = async () => {
        if (!editedTodo) return;

        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/todos/${editedTodo.id}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: editedTodo.title,
                description: editedTodo.description,
                status: editedTodo.status,
                priority: editedTodo.priority
            }),
        });

        if (!res.ok) return alert("Erreur lors de la sauvegarde");

        alert("Modifications enregistrées !");
    };

    const handleDelete = async () => {
        if (!todo) return;

        if (!confirm("Supprimer ce todo ?")) return;

        const token = localStorage.getItem("token");

        const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) return alert("Erreur lors de la suppression");

        alert("Todo supprimé !");
        navigate("/todos");
    };

    if (loading) return <div className="text-center mt-20">Chargement...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;
    if (!editedTodo) return null;

    return (
        <div className="w-full flex flex-wrap justify-center gap-10">
            <NavBar />

            <div className="w-2/3 bg-base-300 p-5 rounded-xl mt-10">

                <h2 className="text-2xl font-bold mb-4">
                    Todo : {editedTodo.title}
                </h2>

                <p className="opacity-70">ID : {editedTodo.id}</p>
                <p className="opacity-70">Utilisateur : {editedTodo.user_id}</p>
                <p className="opacity-70 mb-4">Créé le : {new Date(editedTodo.created_at).toLocaleString()}</p>

                <div className="flex flex-col gap-3">

                    <label>
                        Titre :
                        <input
                            name="title"
                            value={editedTodo.title}
                            onChange={handleChange}
                            className="input w-full"
                        />
                    </label>

                    <label>
                        Description :
                        <textarea
                            name="description"
                            value={editedTodo.description}
                            onChange={handleChange}
                            className="textarea w-full"
                        />
                    </label>
                                    {/* Enregistrement des status dans la db */}
                    <label>
                        Statut :
                        <select
                            name="status"
                            value={editedTodo.status}
                            onChange={handleChange}
                            className="select w-full"
                        >
                            <option value="Not started">Not started</option>
                            <option value="To do">To do</option>
                            <option value="In progress">In progress</option>
                            <option value="Finished">Finished</option>
                        </select>
                    </label>
                             {/* Enregistrement des priorités dans la db */}
                    <label>
                        Priorité :
                        <select
                            name="priority"
                            value={editedTodo.priority}
                            onChange={handleChange}
                            className="select w-full"
                        >
                            <option value="Urgent">Urgent</option>
                            <option value="Average">Average</option>
                            <option value="Down">Down</option>
                        </select>
                    </label>

                    <button className="btn btn-primary mt-3" onClick={handleSave}>
                        Sauvegarder
                    </button>
                </div>

                <div className="mt-6 flex gap-4">
                    <button className="btn btn-accent" onClick={() => navigate("/todos")}>
                        Retour aux todos
                    </button>

                    <button className="btn btn-error" onClick={handleDelete}>
                        Supprimer
                    </button>

                    <button className="btn btn-info" onClick={() => navigate("/todos")}>
                        Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Todo;