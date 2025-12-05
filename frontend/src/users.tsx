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

function Users() {
    const [users, setUsers] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
          document.documentElement.setAttribute("data-theme", savedTheme);
        }
      }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/users", {
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
                setUsers(data);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [navigate]);

    if (loading)
        return <div className="w-full text-center mt-10 text-xl">Chargement...</div>;

    return (
        <div className="w-full flex flex-wrap justify-center gap-10">
            <NavBar />

            <div className="w-3/4 bg-base-300 p-6 rounded-2xl mt-10">
                <h2 className="text-2xl font-bold mb-5">Liste des utilisateurs</h2>

                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Firstname</th>
                            <th>Email</th>
                            <th>Birthdate</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.firstname}</td>
                                <td>{u.email}</td>
                                <td>{new Date(u.birthdate).toLocaleDateString()}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => navigate(`/users/${u.id}`)}
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

export default Users;
