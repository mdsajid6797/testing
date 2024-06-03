import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const getInternationalAsset = (token, userId) => {
    return myAxios.get('/internationalAsset/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};
export const addInternationalAsset = (formData, token) => {
    return myAxios.post('/internationalAsset/' , formData, { headers: { authorization: token, 'Content-Type': "multipart/form-data"} }).then((response) => response.data);
};
export const getSingleInternationalAsset = async (token, id) => {
    try {
        const response = await myAxios.get(`/internationalAsset/internationalAsset/${id}`, { headers: { authorization: token } });
        return response.data;
    } catch (error) {
        throw error; 
    }
};
export const updateInternationalAsset = (internationalAsset, token,) => {
    return myAxios.put("/internationalAsset/", internationalAsset, { headers: { authorization: token } }).then((response) => response.data);
};
export const deleteInternationalAsset = (internationalAssetId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/internationalAsset/internationalAsset/${internationalAssetId}`, { headers: { authorization: token } }).then((response) => response.data);
}