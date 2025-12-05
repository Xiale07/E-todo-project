import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { House } from 'lucide-react';
import { User } from 'lucide-react';
import { Users } from 'lucide-react';
import { Settings } from 'lucide-react';
import { List } from 'lucide-react' ;

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      <div
        onClick={toggleMenu}
        className="fixed top-3 left-3 z-[1000] cursor-pointer text-3xl"
      >
        ☰
      </div>
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-[998] ${
          isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <nav
        className={`
          bg-base-300 
          fixed top-0 left-0 
          h-screen w-64 
          p-4 
          z-[999]
          transform transition-transform duration-300
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <ul className="menu bg-base-300 w-full rounded-box text-lg gap-2 pt-20">

          <li><NavLink className="btn btn-ghost justify-start" to="/user/todos" onClick={() => setIsMenuOpen(false)}><House/>Home</NavLink></li>
          <li className="divider m-0" />

          <li><NavLink className="btn btn-ghost justify-start" to="/user" onClick={() => setIsMenuOpen(false)}><User/>User</NavLink></li>
          <li className="divider m-0" />

          <li><NavLink className="btn btn-ghost justify-start" to="/users" onClick={() => setIsMenuOpen(false)}><Users/>Users</NavLink></li>
          <li className="divider m-0" />

          <li><NavLink className="btn btn-ghost justify-start" to="/settings" onClick={() => setIsMenuOpen(false)}><Settings/>Settings</NavLink></li>
          <li className="divider m-0" />

          <li><NavLink className="btn btn-ghost justify-start" to="/todos" onClick={() => setIsMenuOpen(false)}><List/>AllTodos</NavLink></li>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;