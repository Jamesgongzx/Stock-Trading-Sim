import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
// @material-ui/icons
import Person from "@material-ui/icons/Person";
// import Search from "@material-ui/icons/Search";
// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks({ ...props }) {
    const classes = useStyles();
    // const [openNotification, setOpenNotification] = React.useState(null);
    const [openProfile, setOpenProfile] = React.useState(null);
    const [money, setMoney] = React.useState(null);
    // const handleClickNotification = event => {
    //   if (openNotification && openNotification.contains(event.target)) {
    //     setOpenNotification(null);
    //   } else {
    //     setOpenNotification(event.currentTarget);
    //   }
    // };
    // const handleCloseNotification = () => {
    //   setOpenNotification(null);
    // };
    //   requestGET("/accounts/players")
    //       .then((res) => {
    //           console.log(res.data);
    //           if(res.data.length > 0)   {
    //               setMoney(res.data[0].money)
    //           } else {
    //               setMoney(0);
    //           }
    //       })
    const handleClickProfile = (event) => {
        if (openProfile && openProfile.contains(event.target)) {
            setOpenProfile(null);
        } else {
            setOpenProfile(event.currentTarget);
        }
    };
    const handleClose = () => {
        // window.location.pathname = "/user/profile";
        setOpenProfile(null);
    };

    const handleCloseProfile = () => {
        props.history.push("/user/profile");
        handleClose();
    };

    const handleLogOut = () => {
        window.location.pathname = "/";
        handleClose();
    };

    return (
        <div>
            <div className={classes.manager}>
                <Button
                    color={window.innerWidth > 959 ? "transparent" : "white"}
                    justIcon={window.innerWidth > 959}
                    simple={!(window.innerWidth > 959)}
                    aria-owns={openProfile ? "profile-menu-list-grow" : null}
                    aria-haspopup="true"
                    onClick={handleClickProfile}
                    className={classes.buttonLink}
                >
                    <Person className={classes.icons} />
                    <Hidden mdUp implementation="css">
                        <p className={classes.linkText}>Profile</p>
                    </Hidden>
                </Button>
                <Poppers
                    open={Boolean(openProfile)}
                    anchorEl={openProfile}
                    transition
                    disablePortal
                    className={
                        classNames({ [classes.popperClose]: !openProfile }) +
                        " " +
                        classes.popperNav
                    }
                >
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            id="profile-menu-list-grow"
                            style={{
                                transformOrigin:
                                    placement === "bottom"
                                        ? "center top"
                                        : "center bottom",
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList role="menu">
                                        <MenuItem
                                            onClick={handleCloseProfile}
                                            className={classes.dropdownItem}
                                        >
                                            {/*<Switch>*/}
                                            {/*  <Route*/}
                                            {/*      path="/user/profile"*/}
                                            {/*      component={UserProfile}*/}
                                            {/*  />*/}
                                            {/*</Switch>*/}
                                            Profile
                                        </MenuItem>
                                        {/*<MenuItem*/}
                                        {/*    onClick={handleClose}*/}
                                        {/*    className={classes.dropdownItem}*/}
                                        {/*>*/}
                                        {/*    Change User*/}
                                        {/*</MenuItem>*/}
                                        {/*  <MenuItem*/}
                                        {/*      onClick={handleClose}*/}
                                        {/*      className={classes.dropdownItem}*/}
                                        {/*  >*/}
                                        {/*    Settings*/}
                                        {/*  </MenuItem>*/}
                                        <Divider light />
                                        <MenuItem
                                            onClick={handleLogOut}
                                            className={classes.dropdownItem}
                                        >
                                            Logout
                                        </MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Poppers>
            </div>
        </div>
    );
}
