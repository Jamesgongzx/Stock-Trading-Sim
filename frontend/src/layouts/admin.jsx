import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import {makeStyles, withStyles} from "@material-ui/core/styles";
// core components
import Navbar from "../components/Navbars/Navbar.js";
// import Footer from "../components/Footer/Footer.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
// import FixedPlugin from "components/FixedPlugin/FixedPlugin.js";

import routes from "../routes.js";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "../assets/img/sidebar-2.jpg";
import logo from "../assets/img/reactlogo.png";
import {requestGET} from "../requests";
import PropTypes from "prop-types";
import * as Swal from "sweetalert2";

class Admin extends React.Component {
    constructor(props) {
        super(props)
        this.mainPanel = React.createRef();
        this.ps = null;
        this.image = bgImage;
        this.color = "blue";
        this.state = {
            mobileOpen: false,
            players: [],
            currentPlayer: null,
            admin: this.props.admin,
            stocks: 0,
            doneLoading: false,
        }

        this.swalLoad = Swal.fire({
            title: "Loading Profile...",
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
    }

    getRoute = () => {
        console.log(window.location.pathname);
        return window.location.pathname !== "/user/maps";
    };

    resizeFunction = () => {
        if (window.innerWidth >= 960) {
            this.setState({
                mobileOpen: false
            })
        }
    };

    handleDrawerToggle = () => {
        this.setState({
            mobileOpen: !this.state.mobileOpen
        })
    };

    getStockCount = (playerId) => {
        return requestGET(`/players/${playerId}/stocks/count`)
            .then((results) => {
                console.log(results)
                if (results.data.length > 0) {
                    this.setState({
                        stocks: results.data[0].total
                    })
                }
            })
    };

    handleGetAccountsInfo = () => {
        return requestGET("/accounts/players")
            .then((res) => {
                console.log(res.data);
                if(res.data.length > 0)   {
                    let currentPlayer = res.data[0];
                    currentPlayer.money = (Math.round(currentPlayer.money * 100) / 100).toFixed(2);
                    this.setState({
                        players: res.data,
                        currentPlayer: currentPlayer
                    })
                    return res.data[0]
                }
                return null;
            })
            .then((player) => {
                if (player) {
                    return requestGET(`/accounts/players/${player.playerId}` )
                        .then(() => Promise.resolve(player))
                        .catch((err) => console.log(err))
                }
                return Promise.resolve(null);
            })
            .then((player) => {
                if (player) {
                    return this.getStockCount(player.playerId)
                        .then(() => Promise.resolve(player))
                }
                return Promise.resolve(null)
            })
            .then(() => {
                this.setState({
                    doneLoading: true
                })
            })
            .catch(() => {
                this.setState({
                    doneLoading: true
                })
            })
            // .then((player) => {
            //     if (player) {
            //         return requestGET(`/accounts/admin`)
            //     }
            //     return Promise.resolve(null);
            // })
            // .then((res) => {
            //     if (res && res.data.length > 0) {
            //         this.setState({
            //             admin: true
            //         })
            //     }
            // })
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        // this.handleGetAccountsInfo(); //might be too many queries if we do this
    }

    componentDidMount() {
        if (navigator.platform.indexOf("Win") > -1) {
            // this.ps = new PerfectScrollbar(this.mainPanel.current, {
            //     suppressScrollX: true,
            //     suppressScrollY: false
            // });
            document.body.style.overflow = "hidden";
        }
        Swal.fire({
            title: "Loading Profile...",
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })
        window.addEventListener("resize", this.resizeFunction);
        this.handleGetAccountsInfo().then(() => {
            Swal.close();
        }).catch(() => {
            Swal.close();
        })

    }

    componentWillUnmount() {
        if (navigator.platform.indexOf("Win") > -1) {
            this.ps.destroy();
        }
        window.removeEventListener("resize", this.resizeFunction);
    }

    render() {
        const {classes} = this.props;
        this.filteredRoutes = routes.filter((x) => {
            if (x.icon == null) return false;

            if (x.type === "admin" && this.state.admin === false) return false;
            if (x.type === "admin" && this.state.admin === true) return true;

            return true;
        });
        this.switchRoutes = (
            <Switch>
                {routes.map((prop, key) => {
                    // console.log(prop);
                    if ((prop.type === "admin" && this.state.admin === true) || prop.type === "user") {
                        // console.log(`rendering: ${prop.path}`);
                        return (
                            <Route
                                path={prop.layout + prop.path}
                                // component={prop.component}
                                render={() => {
                                    let Element = prop.component;
                                    return <Element {...this.props} {...this.state} handleGetAccountsInfo={this.handleGetAccountsInfo}/>;
                                }}
                                key={key}
                            />
                        );
                    }
                    return null;
                })}
                <Redirect from="/user" to="/user/dashboard" />
            </Switch>
        );
        return (
            <React.Fragment>
            {this.state.doneLoading ?
            <div className={classes.wrapper}>
                <Sidebar
                    routes={this.filteredRoutes}
                    logo={logo}
                    image={this.image}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.mobileOpen}
                    color={this.color} handleGetAccountsInfo={this.handleGetAccountsInfo}
                    {...this.props} {...this.state}
                />
                <div className={classes.mainPanel} ref={this.mainPanel}>
                    <Navbar
                        routes={this.filteredRoutes}
                        handleDrawerToggle={this.handleDrawerToggle}
                        {...this.props} {...this.state} handleGetAccountsInfo={this.handleGetAccountsInfo}
                    />
                    {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
                    {this.getRoute() ? (
                        <div className={classes.content}>
                            <div className={classes.container}>{this.switchRoutes}</div>
                        </div>
                    ) : (
                        <div className={classes.map}>{this.switchRoutes}</div>
                    )}
                </div>
            </div>
                    :<div></div>
            }
            </React.Fragment>
        );
    }
}


Admin.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Admin);
