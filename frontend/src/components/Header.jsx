import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from './logo.jpg';
import './header.css';

export default function Header() {
    const loggedData = useContext(UserContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("nutrify-user");
        loggedData.setLoggedUser(null);
        navigate("/login");
    }

    return (
        <div className="navbar">
             <div className="navbar-brand">
                <img src={logo} alt="Logo" className="navbar-logo" />
            </div>
            {/* <div className="navbar-brand">Nutrify</div> */}
            <div className="navbar-links">
                <Link to="/track" className="navbar-link abc">Track</Link>
                <Link to="/diet" className="navbar-link act">Activity</Link>
            </div>
            <div className="navbar-logout">
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>
        </div>
    );
}
