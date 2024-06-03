import { myAxios } from "./helper";
import { getToken } from "./user-service";

export const vehicle = (vehicle, token) => {
    return myAxios.post("/vehicle/", vehicle, { headers: { authorization: token } }).then((response) => response.data);
};
export const getVehicle = (token, userId) => {
    return myAxios.get('/vehicle/' + userId, { headers: { authorization: token } }).then((response) => response.data);
};

export const updateVehicles = (vehicle, token,) => {
    return myAxios.put("/vehicle/", vehicle, { headers: { authorization: token } }).then((response) => response.data);
};
export const getSingleVehicle = (token, id) => {
    return myAxios.get('/vehicle/vehicle/' + id, { headers: { authorization: token } }).then((response) => response.data);
};
export const deleteVehicle = (vehicleId) => {
    let token = "Bearer " + getToken();
    return myAxios.delete(`/vehicle/vehicle/${vehicleId}`, { headers: { authorization: token } }).then((response) => response.data);
}
export const downloadDocument1 = (id) => {
    let token = "Bearer " + getToken();
    return myAxios.get('/common/' + id, { responseType: "blob", headers: { authorization: token } });
}