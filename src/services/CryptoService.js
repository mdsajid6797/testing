import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const cryptoAssests = (cryptoAssests, token) => {
    return myAxios.post("/cryptoAssests/", cryptoAssests, { headers: { authorization: token } }).then((response) => response.data);
};
export const getCryptoAssests = (token, userId) => {
    return myAxios.get('/cryptoAssests/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};
export const updateCryptoAssests = (cryptoAssests, token,) => {
    return myAxios.put("/cryptoAssests/", cryptoAssests, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSingleCryptoAssest = (token, id) => {
    return myAxios.get('/cryptoAssests/cryptoAssests/' + id, { headers: { authorization: token } }).then((response) => response.data);
};

export const deleteCryptoAssest = (cryptoAssestsId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/cryptoAssests/cryptoAssests/${cryptoAssestsId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}