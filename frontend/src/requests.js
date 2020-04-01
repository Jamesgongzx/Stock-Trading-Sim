import axios from "axios";

const URL = "http://localhost:4000";

export const requestGET = (route, params) => {
    return axios
        .get(
            URL+route,
            {
                params: params
            }
        )

};

export const requestPOST = (route, data) => {
    return axios.post(
        URL+route,
        data,
        { withCreditential: true }
    )
};
