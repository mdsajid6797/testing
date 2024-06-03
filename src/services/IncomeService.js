import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const income = (income, token) => {
    return myAxios.post("/income/", income, { headers: { authorization: token } }).then((response) => response.data);
};
export const getIncome = (token, userId) => {
    return myAxios.get('/income/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};

export const updateIncome = (income, token,) => {
    return myAxios.put("/income/", income, { headers: { authorization: token } }).then((response) => response.data);
};

export const getSingleIncome = (token, id) => {
    return myAxios.get('/income/income/' + id, { headers: { authorization: token } })
      .then((response) => response.data)
      .catch((error) => {
        console.error("Error fetching single income:", error);
        throw error; // Re-throw the error to handle it in the calling code if necessary
      });
  };
export const deleteIncome = (incomeId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/income/income/${incomeId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}