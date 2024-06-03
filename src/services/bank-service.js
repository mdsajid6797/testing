import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const getBank = (token, userId) => {
    return myAxios.get('/bank/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};
export const addBank = (formData, token) => {
    return myAxios.post('/bank/' , formData, { headers: { authorization: token, 'Content-Type': "multipart/form-data"} }).then((response) => response.data);
};
export const updateBank = (bank, token,) => {
    return myAxios.put("/bank/", bank, { headers: { authorization: token } }).then((response) => response.data);
};
// export const getSingleBank = (token, id) => {
//     return myAxios.get('/bank/bank/' + id, { headers: { authorization: token } }).then((response) => response.data);
// };
export const getSingleBank = async (token, id) => {
    try {
        const response = await myAxios.get(`/bank/bank/${id}`, { headers: { authorization: token } });
        return response.data;
    } catch (error) {
        throw error; // Re-throw the error to be handled by the caller
    }
};

export const deleteBank = (banksId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/bank/bank/${banksId}`, { headers: { authorization: token } }).then((response) => response.data);
}