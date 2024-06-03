import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const otherAsset = (otherAsset, token) => {
    return myAxios.post("/otherAsset/", otherAsset, { headers: { authorization: token } }).then((response) => response.data);
};

export const getOtherAsset = (token, userId) => {
  return myAxios
    .get('/otherAsset/' + userId, { headers: { authorization: token } })
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        const errorData = error.response.data;
        return Promise.reject(errorData);
      } else if (error.request) {
        return Promise.reject('No response from server');
      } else {
        return Promise.reject(error.message);
      }
    });
};

export const updateOtherAsset = (otherAsset, token,) => {
  return myAxios.put("/otherAsset/", otherAsset, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSingleOtherAsset = (token, id) => {
  return myAxios.get('/otherAsset/otherAsset/' + id, { headers: { authorization: token } }).then((response) => response.data);
};

export const deleteOtherAsset = (otherAssetId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/otherAsset/otherAsset/${otherAssetId}`, { headers: { authorization: token } }).then((response) => response.data);
}