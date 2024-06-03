import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const insurance = (insurance, token) => {
    return myAxios.post("/insurance/", insurance, { headers: { authorization: token } }).then((response) => response.data);
};
export const getInsurance = (token, userId) => {
    return myAxios.get('/insurance/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};

export const updateInsurance = (insurance, token,) => {
    return myAxios.put("/insurance/", insurance, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSingleInsurance = (token, id) => {
    return myAxios.get('/insurance/insurance/' + id, { headers: { authorization: token } }).then((response) => response.data);
};
export const deleteInsurance = (insuranceId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/insurance/insurance/${insuranceId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}