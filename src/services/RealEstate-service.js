import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const realEstates = (realEstates, token) => {
    return myAxios.post("/realEstates/", realEstates, { headers: { authorization: token } }).then((response) => response.data);
};
export const getRealEstates = (token, userId) => {
    return myAxios.get('/realEstates/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};

export const updateRealEstates = (realEstates, token,) => {
    return myAxios.put("/realEstates/", realEstates, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSingleRealEstate = (token, id) => {
    return myAxios.get('/realEstates/realEstates/' + id, { headers: { authorization: token } }).then((response) => response.data);
};

export const deleteRealEstate = (realEstateId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/realEstates/realEstates/${realEstateId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}