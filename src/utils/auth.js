import axios from "axios";

const login = async (email, password) => {
    try {
        const body = { email, password };
        const response = await axios.post("http://localhost:5000/api/auth/login", body);

        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message };

    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Server error" };
    }
};

const register = async (email, password) => {
    try {
        const body = { email, password };
        const response = await axios.post("http://localhost:5000/api/auth/register", body);

        if (response.data.success) {
            return { success: true, message: response.data.message };
        }
        return { success: false, message: response.data.message };

    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Server error" };
    }
};

const userid = async (email) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/auth/userid?email=${email}`);

        if (response.data.success) {
            return { success: true, userid: response.data.userid };
        }
        return { success: false, message: "User not found" };

    } catch (err) {
        return { success: false, message: "Server error" };
    }
};



export {login,register,userid};