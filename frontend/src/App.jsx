import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

//Pages
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import GroupSettings from "./pages/group_settings";
import Groups from "./pages/groups"
import Friends from "./pages/friends"
import NavigationBar from "./components/navbar";
import Messaging from "./pages/messaging";


function App() {
  //console.log("running app")

  return (
    <div className="App">
      {/*(() => {
        const location = useLocation();
        const excluded_paths = ["/signup", "/signin", "/"];
        return !excluded_paths.includes(location.pathname);
      })() && <NavigationBar />*/}
      <div className="pages">
        <Routes>
          {/*Default to signup page*/}
          <Route
            path="/"
            element={<SignUp/>}
          />
        <Route
          path="/signup"
          element={<SignUp/>}
        />
        <Route
          path="/signin"
          element={<SignIn/>}
        />
        {/*TODO: use protected routes instead*/}
        <Route 
          path="/dashboard"
          element={<Dashboard/>}
        />
        <Route 
          path="/settings"
          element={<Settings/>}
        />
        <Route
          path="/friends"
          element={<Friends/>}
        />
        <Route 
          path="/groups"
          element={<Groups/>}
        />
        <Route 
          path="/groups/:group_id/settings"
          element={<GroupSettings/>}
        />
        <Route
          path="/groups/:group_id/messaging"
          element={<Messaging/>}
        />
        </Routes>
      </div>
    </div>
  )
}

export default App;
