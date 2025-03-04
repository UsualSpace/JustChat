import { Link } from "react-router-dom";
import "../styles/navbar.css"; // Import the CSS file

const NavigationBar = () => {
  return (
    <div className="navbar">
      {/* Title at the top */}
      <h2 className="navbar-title">JustChat</h2>

      {/* Navigation links */}
      <nav className="navbar-nav">
        <Link to="/groups" className="navbar-link">Groups</Link>
        <Link to="/friends" className="navbar-link">Friends</Link>
        <Link to="/settings" className="navbar-link">Settings</Link>
      </nav>

      {/* Sign Out button at the bottom */}
      {/*<button className="signout-button" onClick={onLogout}>Sign Out</button>*/}
      <button className="btn-destructive">Sign Out</button>
    </div>
  );
};

export default NavigationBar;