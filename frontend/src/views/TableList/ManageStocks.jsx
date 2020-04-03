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

class ManageStocks extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            columnNames : [],
            values: [],
            stock: null,
            selectedStock: null,
            transactionType: null,
            qtyShares: 0,
        }
    }

    getAllStocks = () => {
        requestGET(`/stocks`, )
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

    componentDidMount() {
        this.getAllStocks();
    }

    handleSearchSubmit = (event) => {
        event.preventDefault();
        return requestGET(`/stocks/${this.state.stock}`, )
            .then((res) => {
                console.log(res);
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        // values: data.map((x) => Object.values(x)),
                        selectedStock: data[0].name
                    })
                }
                else {
                    this.setState({
                        // values: [],
                        selectedStock: null
                    })
                    helpers.Toast.fire({
                        icon: 'warning',
                        title: `Stock not found :(`
                    })
                }
            })
    }

    handleStockBarChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    handleCloseDialog = () => {
        this.setState({
            selectedStock: null
        })
        // this.getAllStocks();
    }

    handleTransactionSubmit = (event) => {
        console.log(event);
        event.preventDefault();
        if (this.state.transactionType === "delete") {
            return requestDEL(`/stocks/${this.state.selectedStock}`)
                .then(() => {
                    helpers.Toast.fire({
                        icon: 'success',
                        title: `Deleted this stock: ${this.state.selectedStock}`
                    })
                })
                .catch((err) => {
                    helpers.Toast.fire({
                        icon: 'error',
                        title: `Uh oh, something went wrong: ${err}`
                    })
                })
                .then(() => {
                    this.setState({
                        selectedStock: null,
                    })
                    return this.getAllStocks()
                })
        }
    }

    render() {
        const {classes} = this.props;
        console.log(this.state);
        return (
            <React.Fragment>
                {this.state.selectedStock != null ?
                    <Dialog aria-labelledby="simple-dialog-title" onClose={this.handleCloseDialog}
                            fullWidth={true}
                            maxWidth={"sm"}
                            open={() => this.state.selectedStock != null}>
                        <DialogTitle id="customized-dialog-title">
                            Stock Name: {this.state.selectedStock}
                        </DialogTitle>
                        <form onSubmit={this.handleTransactionSubmit}>
                            <DialogContent dividers>
                                <div>
                                    Are you sure you want to delete this stock?
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button  type="submit" color="success" className={classes.green}
                                         onClick={() => {this.setState({transactionType: "delete"})}}>
                                    Confirm
                                </Button>
                            </DialogActions>
                        </form>
                    </Dialog>
                    :
                    <React.Fragment></React.Fragment>
                }
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardHeader color="primary">
                                <h4 className={classes.cardTitleWhite}>Manage Stocks</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Search for a stock to manage:
                                </p>
                            </CardHeader>
                            <form onSubmit={this.handleSearchSubmit} className={classes.stocksearchform}>
                                <OutlinedInput
                                    type="stock"
                                    name="stock"
                                    placeholder="Search for a stock..."
                                    value={this.state.stock}
                                    onChange={this.handleStockBarChange}
                                />
                                <Button className="submit" type="submit" size="md">
                                    Submit
                                </Button>
                            </form>
                            <CardBody>
                                {this.state.values.length <= 0 ?
                                    "No Stocks Found :("
                                    :
                                    <Table
                                        tableHeaderColor="primary"
                                        tableHead={this.state.columnNames}
                                        tableData={this.state.values}
                                    />
                                }
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
            </React.Fragment>
        );
    }
}

ManageStocks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManageStocks);
