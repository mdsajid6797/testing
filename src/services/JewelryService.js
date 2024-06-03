import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const jewelries = (jewelries, token) => {
    return myAxios.post("/jewelries/", jewelries, { headers: { authorization: token } }).then((response) => response.data);
};
export const getJewelries = (token, userId) => {
    return myAxios.get('/jewelries/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};

export const updateJewelries = (jewelries, token,) => {
    return myAxios.put("/jewelries/", jewelries, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSinglejewelry = (token, id) => {
    return myAxios.get('/jewelries/jewelries/' + id, { headers: { authorization: token } }).then((response) => response.data);
};

export const deleteJewelry = (jewelryId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/jewelries/jewelries/${jewelryId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}