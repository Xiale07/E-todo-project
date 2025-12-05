import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from './Burger.tsx'

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstname: "",
        name: "",
        email: "",
        birthdate: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: { target: { name: any; value: any; }; }) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        const { confirmPassword, ...toSend } = form;

        try {
            const res = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(toSend),
            });

            const data = await res.json();

            if (data.success) {

                navigate("/login");
            } else {
                alert(data.message || "Erreur serveur");
            }
        } catch (err) {
            alert("Erreur réseau");
        }
    };
    
    useEffect(() => {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme) {
              document.documentElement.setAttribute("data-theme", savedTheme);
            }
          }, []);

    return (
        <div className="w-full flex flex-wrap justify-center gap-10">

            <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
                <form className="gap-8 flex flex-col" onSubmit={handleRegister}>
                    
                    <div>
                        Name
                        <input
                            name="name"
                            type="text"
                            className="input w-full"
                            placeholder="Name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        First name
                        <input
                            name="firstname"
                            type="text"
                            className="input w-full"
                            placeholder="Firstname"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        Mail
                        <input
                            name="email"
                            type="email"
                            className="input w-full"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        Date of birth
                        <input
                            name="birthdate"
                            type="date"
                            className="input w-full"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        Password
                        <input
                            name="password"
                            type="password"
                            className="input w-full"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        Confirm password
                        <input
                            name="confirmPassword"
                            type="password"
                            className="input w-full"
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="btn btn-primary" type="submit">
                        Sign up
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/login")}
                        type="button"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;
