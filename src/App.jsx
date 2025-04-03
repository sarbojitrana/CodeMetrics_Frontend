import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./homapage";
import UserDetailsPage from "./user_details";
import AuthPages from "./authpage";
import UsernameManagementPage from "./add";
import Login1 from "./admin_auth";
const app=()=>{
  return(
    <Router>
    <Routes>
        <Route path='/'element={<AuthPages></AuthPages>}/>
        <Route path='/Homepage/:userId' element={<HomePage/>}/>
        <Route path='/user-detail/:username' element={<UserDetailsPage/>}/>
        <Route path='/addusers/:email' element={<UsernameManagementPage></UsernameManagementPage>}></Route>
        <Route path='/admin-login' element={<Login1></Login1>}/>
    </Routes>
    </Router>
  );
}

export default app;