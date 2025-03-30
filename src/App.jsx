import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homapage";
import UserDetailsPage from "./user_details";
const app=()=>{
  return(
    <Router>
    <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/user-detail/:username' element={<UserDetailsPage/>}/>
    </Routes>
    </Router>
  );
}

export default app;