import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from './Burger.tsx';

function Login() {
  const navigate = useNavigate();
  const [canRetry, setCanRetry] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
          const savedTheme = localStorage.getItem("theme");
          if (savedTheme) {
            document.documentElement.setAttribute("data-theme", savedTheme);
          }
        }, []);

  function handleSubmit(event: { preventDefault: () => void; }) {
    event.preventDefault();

    if (!canRetry) return;

    setError("");

    axios.post("http://localhost:3000/login", { email, password })
      .then(res => {

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
        }

        navigate("/user/todos");
      })
      .catch(err => {
        if (err.response && err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError("Erreur interne");
        }

        setCanRetry(false);
        setTimeout(() => {
          setCanRetry(true);
        }, 5000);
      });
  }

  

  return (
    <div className="w-full flex flex-wrap justify-center gap-10">

      <form onSubmit={handleSubmit} className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">

        <div className="gap-8 flex flex-col">

          <div>
            Email
            <input
              name="email"
              type="text"
              className="input w-full"
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            Password
            <input
              type="password"
              className="input w-full"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={!canRetry}>
            {canRetry ? "Sign in" : "Attendez 5 secondes..."}
          </button>

          {error && (
            <div className="text-red-500 font-semibold text-center">
              {error}
            </div>
          )}

          <div>
            Don't have an account yet?
            <button
              type="button"
              className="btn btn-soft w-1/3 m-2"
              onClick={() => navigate("/register")}
            >
              Sign up
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

export default Login;
