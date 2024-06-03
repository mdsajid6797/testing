import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const investment = (investment, token) => {
    return myAxios.post("/investments/", investment, { headers: { authorization: token } }).then((response) => response.data);
};
export const getInvestments = (token, userId) => {
    return myAxios.get('/investments/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};

export const updateInvestments = (investment, token,) => {
    return myAxios.put("/investments/", investment, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSingleInvestment = (token, id) => {
    return myAxios.get('/investments/investments/' + id, { headers: { authorization: token } }).then((response) => response.data);
};
export const deleteInvestment = (investmentId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/investments/investments/${investmentId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}