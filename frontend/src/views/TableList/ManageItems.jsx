import React from "react";
// @material-ui/core components
import Input from '@material-ui/core/Input';
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import PropTypes from 'prop-types';
import {requestDEL, requestGET, requestPOST} from "../../requests";
import Dialog from "@material-ui/core/Dialog";
import {OutlinedInput} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
// import withStyles from "@material-ui/core/styles/withStyles";
import Swal from 'sweetalert2'
import helpers from "../../utils.js"
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select/Select";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";

const styles = {
    cardCategoryWhite: {
        "&,& a,& a:hover,& a:focus": {
            color: "rgba(255,255,255,.62)",
            margin: "0",
            fontSize: "14px",
            marginTop: "0",
            marginBottom: "0"
        },
        "& a,& a:hover,& a:focus": {
            color: "#FFFFFF"
        }
    },
    cardTitleWhite: {
        color: "#FFFFFF",
        marginTop: "0px",
        minHeight: "auto",
        fontWeight: "300",
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        marginBottom: "3px",
        textDecoration: "none",
        "& small": {
            color: "#777",
            fontSize: "65%",
            fontWeight: "400",
            lineHeight: "1"
        }
    },
    green: {
        color: "#259200",
    },
    red: {
        color: "#ac1a02"
    },
    stocksearchform : {
        margin: "20px",
        marginBottom: "0px"
    }
};

class ManageItems extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            columnNames : [],
            values: [],
            joinOption: null,
        }
        this.joinOptions = {
            "itemRarity": "Item Rarity",
            "shopItemR": "Shop Items",
            "playerItemR": "Player Items",
        }
    }

    getItemsJoin = (joinOption) => {
        requestGET(`/items`, {projections: joinOption})
            .then((res) => {
                console.log(res);
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        columnNames: Object.keys(data[0]),
                        values: data.map((x) => Object.values(x))
                    })
                }
            })
    }

    handleJoinOptionChange = (e) => {
        this.setState({joinOption: e.target.value});
        this.getItemsJoin(e.target.value)
    }


    render() {
        const {classes} = this.props;
        console.log(this.state)
        return (
            <React.Fragment>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Manage Items</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Select a view
                                </p>
                            </CardHeader>
                            <CardBody>
                                <FormControl component="fieldset">
                                    <RadioGroup aria-label="gender" name="gender1" value={this.state.joinOption}
                                                onChange={(e) => {this.handleJoinOptionChange(e)}}>
                                        {Object.entries(this.joinOptions).map((x) => {
                                            return <FormControlLabel value={x[0]} control={<Radio />} label={x[1]} />
                                        })}
                                    </RadioGroup>
                                </FormControl>

                                <Table
                                    tableHeaderColor="primary"
                                    tableHead={this.state.columnNames}
                                    tableData={this.state.values}
                                />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </React.Fragment>
        );
    }
}

ManageItems.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageItems);
