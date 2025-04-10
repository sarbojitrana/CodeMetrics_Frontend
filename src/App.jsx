import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leaderboard from "./pages/Leaderboard";
import UserDetailsPage from "./pages/codeforces_profile";
import AuthPages from "./pages/authpage";
import UsernameManagementPage from "./pages/username_management";
import CPDashboard from "./pages/dashboard";
const app=()=>{
  return(
    <Router>
    <Routes>
        <Route path='/'element={<AuthPages></AuthPages>}/>
        <Route path='/dashboard/:email' element={<CPDashboard/>}/>
        <Route path='/leaderboard/:userId' element={<Leaderboard/>}/>
        <Route path='/user-detail/:username' element={<UserDetailsPage/>}/>
        <Route path='/username-management/:email' element={<UsernameManagementPage></UsernameManagementPage>}></Route>
    </Routes>
    </Router>
  );
}

export default app;