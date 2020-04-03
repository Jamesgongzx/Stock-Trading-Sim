import React from "react";
// @material-ui/core components
import {makeStyles, withStyles} from "@material-ui/core/styles";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "../../components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import InputLabel from "@material-ui/core/InputLabel";
import CardAvatar from "../../components/Card/CardAvatar";
import PropTypes from "prop-types";
import {requestPOST} from "../../requests";
import helpers from "../../utils";
import {OutlinedInput} from "@material-ui/core";

const styles = {
    cardCategoryWhite: {
        color: "rgba(255,255,255,.62)",
        margin: "0",
        fontSize: "14px",
        marginTop: "0",
        marginBottom: "0"
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none"
    }
};

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changeusername: "",
            changeemail: "",
        }
    }

    updateProfile() {
        console.log(this.props);
        requestPOST("/accounts/update-profile", {username: this.state.changeusername, email: this.state.changeemail})
            .then((result) => {
                helpers.Toast.fire({
                    icon: 'success',
                    title: `Successfully updated profile`
                })
                this.props.changeProps({
                    email: this.state.changeemail,
                    username: this.state.changeusername,
                })
            })
            .catch((err) => {
                helpers.Toast.fire({
                    icon: 'warning',
                    title: `Something went wrong: ${err}`
                })
            })
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={8}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                                <p className={classes.cardCategoryWhite}>Complete your profile</p>
                            </CardHeader>
                            <CardBody>
                                <GridContainer>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <OutlinedInput
                                            labelText="Username"
                                            id="username"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            placeholder="Username"
                                            value={this.state.changeusername}
                                            onChange={(e) => {this.setState({changeusername: e.target.value})}}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={12} md={6}>
                                        <OutlinedInput
                                            labelText="Email address"
                                            id="email-address"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            placeholder="Email"
                                            value={this.state.changeemail}
                                            onChange={(e) => {this.setState({changeemail: e.target.value})}}
                                        />
                                    </GridItem>
                                </GridContainer>
                        </CardBody>
                            <CardFooter>
                                <Button color="primary"
                                        onClick={() => {this.updateProfile()}}
                                >
                                    Update Profile</Button>
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={12} md={4}>
                        <Card profile>
                            <CardAvatar profile>
                                {/*<a href="#pablo" onClick={e => e.preventDefault()}>*/}
                                {/*</a>*/}
                            </CardAvatar>
                            <CardBody profile>
                                <h6 className={classes.cardCategory}>  </h6>
                                <h3 className={classes.description}>Username: {this.props.username}</h3>
                                <h3 className={classes.description}>Email: {this.props.email}</h3>
                                <p className={classes.description}>

                                </p>
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </div>
        );
    }
}

UserProfile.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UserProfile);
