import axios from "axios";

const add=async (userid,username)=>{
    try{
        const body={userid,username};
        const response=await axios.post("http://localhost:5000/api/user/add", body);
        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message };
    }catch(err){
        return { success: false, message: err.response?.data?.message || "Server error" };
    }
}

const remove=async (userid,username)=>{
    try{
        const body={username,userid};
        const response=await axios.post("http://localhost:5000/api/user/remove", body);
        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message };
    }catch(err){
        return { success: false, message: err.response?.data?.message || "Server error" };
    }
}

const fetchusernames=async (userid)=>{
    try{
        const response=await axios.get(`http://localhost:5000/api/user/fetchusernames?userid=${userid}`);
        if (response.data.success) {
            return { success: true, message: response.data.data };
        }
        return { success: false, message: response.data.data };
    }catch(err){
        return { success: false, message: err.response?.data?.data || "Server error" };
    }
}

export {add,remove,fetchusernames};