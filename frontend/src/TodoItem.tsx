import { Trash } from "lucide-react";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

type Priority = "Urgent" | "Average" | "Down";
type Status = "Not started" | "To do" | "In progress" | "Done";

type Todo = {
    id: number;
    title: string;
    description: string;
    created_at: Date;
    start_time: Date;
    due_time: Date;
    day: Date;
    status: Status;
    priority: Priority;
    user_id: number;
};

type Props = {
    todo: Todo;
    onDelete: () => void;
    onUpdateStatus: (newStatus: Status) => void;
};

const TodoItem = ({ todo, onDelete, onUpdateStatus }: Props) => {
    const [showForm, setShowForm] = useState(false);

    async function updateStatusDB(newStatus: Status) {
        try {
            const token = localStorage.getItem("token");

            await fetch(`http://localhost:3000/todos/${todo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus }),
            });

            onUpdateStatus(newStatus);
        } catch (err) {
            console.error("Erreur update status :", err);
        }
    }



    const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete the task?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found");
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Delete failed: ${res.status}`);
        }

        onDelete?.();
    } catch (err) {
        console.error("Erreur suppression :", err);
    }
};


    return (
        <div className="p-3">
            <div className="flex flex-wrap justify-between items-center gap-2">
                <div className="flex items-center gap-2 flex-wrap flex-grow min-w-0">
                    <span className="text-md font-bold">
                        {todo.start_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}/
                        {todo.due_time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                                                {/* Enregistrement des status dans la db */}
                    <select
                        className="select flex-shrink-0"
                        value={todo.status}
                        onChange={(e) => updateStatusDB(e.target.value as Status)}

                    >
                        <option value="Not started">Not started</option>
                        <option value="To do">To do</option>
                        <option value="In progress">In progress</option>
                        <option value="Done">Done</option>
                    </select>


                    <span className="text-md font-bold">{todo.title}</span>

                    <span
                        className={`badge badge-sm badge-soft ${todo.priority === "Urgent"
                            ? "badge-error"
                            : todo.priority === "Average"
                                ? "badge-warning"
                                : "badge-success"
                            }`}
                    >
                        {todo.priority}
                    </span>
                </div>

                <div className="flex gap-2 justify-end flex-wrap">

                    <button
                        className="btn btn-info btn-sm btn-soft"
                        onClick={() => setShowForm((prev) => !prev)}
                    >
                        {showForm ? <ChevronUp /> : <ChevronDown />}
                    </button>

                    <button onClick={handleDelete} className="btn btn-error btn-sm btn-soft">
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="w-full flex flex-col gap-4 my-5 bg-base-200 p-5 rounded-2xl">
                    <span className="text-md">{todo.description}</span>
                </div>
            )}
        </div>
    );
};

export default TodoItem;
