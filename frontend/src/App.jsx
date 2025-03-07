import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"

//Pages
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import GroupSettings from "./pages/group_settings";
import Groups from "./pages/groups"
import NavigationBar from "./components/navbar";

function App() {
  console.log("running app")

  const ShowNavBar = (location) => {
    //const location = useLocation();
    const excluded_paths = ["/signup", "/signin"];
    return false;//!excluded_paths.includes(location.pathname);
  };

  return (
    <div className="App">
      <BrowserRouter>
        {ShowNavBar(useLocation()) && <NavigationBar/>}
        <div className="pages">
          <Routes>
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
              path="/group-settings"
              element={<GroupSettings/>}
            />
            <Route 
              path="/groups"
              element={<Groups/>}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
