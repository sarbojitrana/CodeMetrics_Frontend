import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Leaderboard from "./pages/Leaderboard";
import UserDetailsPage from "./pages/codeforces_profile";
import AuthPages from "./pages/authpage";
import UsernameManagementPage from "./pages/username_management";
import CPDashboard from "./pages/dashboard";
import CoursePage from "./pages/cp_sheets/pages/course_page";
import CP31_ladder from "./pages/cp_sheets/pages/cp_ladders/cp31_ladder";
import Division_Ladder from "./pages/cp_sheets/pages/cp_ladders/division_wise";
import Rating_Ladder from "./pages/cp_sheets/pages/cp_ladders/rating_wise";
const app=()=>{
  return(
    <Router>
    <Routes>
        <Route path='/'element={<AuthPages></AuthPages>}/>
        <Route path='/dashboard/:email' element={<CPDashboard/>}/>
        <Route path='/leaderboard/:userId' element={<Leaderboard/>}/>
        <Route path='/user-detail/:username' element={<UserDetailsPage/>}/>
        <Route path='/username-management/:email' element={<UsernameManagementPage></UsernameManagementPage>}></Route>
        <Route path='/cp-sheets' element={<CoursePage/>}/>
        <Route path='/CP31_ladder' element={<CP31_ladder/>}/>
        <Route path='/Division_ladder' element={<Division_Ladder/>}/>
        <Route path='/Rating_ladder' element={<Rating_Ladder/>}/>
    </Routes>
    </Router>
  );
}

export default app;