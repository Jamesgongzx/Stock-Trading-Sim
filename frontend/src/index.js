import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app.jsx";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.8.0";

const hist = createBrowserHistory();


ReactDOM.render(
    <Router history={hist}>
        <App history={hist}/>
    </Router>,
    document.getElementById("root")
);
