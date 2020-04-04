import axios from "axios";

const URL = "http://localhost:4000";

axios.defaults.withCredentials = true

export const requestGET = (route, params) => {
    return axios
        .get(
            URL+route,
            {
                params: params,
                withCredentials: true
            }
        )

};

export const requestPOST = (route, data) => {
    return axios.post(
        URL+route,
        data,
        { withCredentials: true }
    )
};

export const requestDEL = (route, data) => {
    return axios.delete(
        URL+route,
        {data: data, withCredentials: true}
    )
}

export const requestPATCH = (route, data) => {
    return axios.patch(
        URL+route,
        {},
        {data: data, withCredentials: true}
    )
}