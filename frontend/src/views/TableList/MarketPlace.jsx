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
import Select from "@material-ui/core/Select/Select";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

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

class MarketPlace extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            columnNames : [],
            values: [],
            dayofWeek: null,
            categories: [],
            category: null,
            qty: 0,
        }

        this.dayOfWeekObject = {
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
            7: "Sunday",
        }
    }


    getShopCategories = () => {
        requestGET("/shops/categories")
            .then((res) => {
                console.log(res.data.map((x) => Object.values(x)));
                this.setState({
                    categories: res.data.map((x) => Object.values(x)[0])
                })
            })
    }

    buyItem = (name) => {
        console.log(this.state)
        requestPOST(`/shops/${this.state.dayofWeek}/${this.state.category}/items/${name}/purchase`, {amount: this.state.qty})
            .then((res) => {
                console.log(res)
                helpers.Toast.fire({
                    icon: 'success',
                    title: `Bought ${this.state.qty} of ${name}!`
                })
                this.props.handleGetAccountsInfo();
            })
            .catch((err) => {
                helpers.Toast.fire({
                    icon: 'warning',
                    title: `Something went wrong: ${err}`
                })
            })
    }

    purchaseFragment = (name) => (
        <React.Fragment>
            <OutlinedInput type="number" size="small"
                           endAdornment={<InputAdornment position="end">QTY</InputAdornment>}
                           InputProps={{ inputProps: { min: 0} }}
                           required
                           defaultValue={0}
                // value={this.state.qty}
                           onChange={(e) => {this.setState({qty: e.target.value})}}
            />
            <Button variant="contained"
                    color="success"
                    onClick={() => {this.buyItem(name)}}
            >
                Buy
            </Button>
        </React.Fragment>
    )

    getShopRecords = () => {
        requestGET(`/shops/${this.state.dayofWeek}/${this.state.category}/items`)
            .then((res) => {
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        columnNames: Object.keys(data[0]),
                        values: data.map((x) => {
                            let name = x.itemName;
                            x = Object.values(x);
                            x.push(this.purchaseFragment(name));
                            return x;
                        })
                    })
                    helpers.Toast.fire({
                        icon: 'success',
                        title: `Items found for ${this.dayOfWeekObject[this.state.dayofWeek]}'s Market: ${this.state.category}!`
                    })
                }
                else {
                    throw Error(`Items couldn't be found for ${this.dayOfWeekObject[this.state.dayofWeek]}'s Market: ${this.state.category}`)
                }
            })
            .catch((err) => {
                helpers.Toast.fire({
                    icon: 'warning',
                    title: `Something went wrong: ${err}`
                })
            })
    }

    componentDidMount() {
        this.getShopCategories();
    }


    render() {
        const {classes} = this.props;
        this.dayOfWeekFragment = (
            <FormControl style={{minWidth: 200}}>
                <InputLabel htmlFor='selected-language'>Day of Week</InputLabel>
            <Select
                name="table"
                value={this.state.dayofWeek}
                onChange={(e) => {this.setState({dayofWeek: e.target.value})}}
                displayEmpty
                className="test2"
            >
                <option value="Day of Week" disabled selected>Day Of Week</option>
                {Object.entries(this.dayOfWeekObject).map((x) => {
                    return(
                        <option value={x[0]}>{x[1]}</option>
                    )
                })
                }
            </Select>
            </FormControl>
        )

        this.categoryFragment = (
            <FormControl style={{minWidth: 200}}>
                <InputLabel htmlFor='selected-language'>Category</InputLabel>
                <Select
                    name="table"
                    value={this.state.category}
                    onChange={(e) => {this.setState({category: e.target.value})}}
                    displayEmpty
                    className="test2"
                >
                    <option value="Category" disabled selected>Category</option>
                    {this.state.categories.map((x) => {
                        return(
                            <option value={x}>{x}</option>
                        )
                    })
                    }
                </Select>
            </FormControl>
        )

        return (
            <React.Fragment>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Shop</h4>
                                <p className={classes.cardCategoryWhite}>
                                </p>
                            </CardHeader>
                            <CardBody>
                                {this.dayOfWeekFragment}
                                {this.categoryFragment}
                                <Button variant="contained" color="primary" style={{margin: "2px"}}
                                        onClick={() => {
                                            this.getShopRecords();
                                        }}
                                >
                                    Search</Button>
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

MarketPlace.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MarketPlace);
