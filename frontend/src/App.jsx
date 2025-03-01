import { BrowserRouter, Routes, Route } from "react-router-dom"

//Pages and components
import SignUp from "./pages/signup"
import SignIn from "./pages/signin"
//import NavigationBar from "./components/navbar"

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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  )
}

export default App;
