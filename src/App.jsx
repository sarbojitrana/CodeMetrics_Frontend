import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homapage";
import UserDetailsPage from "./user_details";
import AuthPages from "./authpage";
const app=()=>{
  return(
    <Router>
    <Routes>
        <Route path='/'element={<AuthPages></AuthPages>}/>
        <Route path='/Homepage/:email' element={<HomePage/>}/>
        <Route path='/user-detail/:username' element={<UserDetailsPage/>}/>
    </Routes>
    </Router>
  );
}

export default app;