import { Route, Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css"; // Import the CSS file
import axios from "axios"

const NavigationBar = () => {

  const navigate = useNavigate();

  const HandleSignOut = async () => {
    try {
      const session_id = sessionStorage.getItem("session_id");
      const response = await axios.delete("http://localhost:4000/api/auth/signout", {
          headers: {
              "authorization": `Bearer ${session_id}`
          }
      });

      localStorage.setItem("session_id", "");
      console.log("successfully signed out");
      navigate("/signin");

    } catch ( error ) {
      console.log(error.response?.data);
    }
  };

  return (
      <>
      <h2 className="navbar-title">JustChat</h2>
      <nav className="navbar-nav">
        <Link to="/groups" className="navbar-link">Groups</Link>
        <Link to="/friends" className="navbar-link">Friends</Link>
        <Link to="/settings" className="navbar-link">Settings</Link>
      </nav>
    
      <button className="btn-destructive" onClick={HandleSignOut}>Sign Out</button>
      </>
  );
};

export default NavigationBar;