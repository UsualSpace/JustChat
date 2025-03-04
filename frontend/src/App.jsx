import { BrowserRouter, Routes, Route } from "react-router-dom"

//Pages
import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import Dashboard from "./pages/dashboard";
import Settings from "./pages/settings";
import GroupSettings from "./pages/group_settings";

function App() {
  console.log("running app")
  return (
    <div className="App">
      <BrowserRouter>
      
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
