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
import { requestGET, requestPOST } from "../../requests";
import Dialog from "@material-ui/core/Dialog";
import { OutlinedInput } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
// import withStyles from "@material-ui/core/styles/withStyles";
import Swal from 'sweetalert2'
import helpers from "../../utils.js"
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Redirect, Route, Switch } from "react-router";
import routes from "../../routes";
import { stockLineChart } from "../../variables/charts";
import CanvasJSReact from '../../assets/jss/canvasjs.react.js';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
    stocksearchform: {
        margin: "20px",
        marginBottom: "0px"
    }
};

class TradeStocks extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            columnNames: [],
            values: [],
            stock: null,
            selectedStock: null,
            transactionType: null,
            qtyShares: 0,
            projectionColumns: {
                name: true,
                currentPrice: true,
                "24hChange": true
            },
            stockgraph: null,
            graph: {
                labels: [],
                series: [],
                data: [],
            }
        }
    }

    getSingleStockGraph = (stock) => {
        return requestGET(`/stocks/${stock}/records`)
            .then((res) => {
                let data = res.data;
                let graph = this.state.graph;
                graph.labels = data.map((x) => x.dateTime).slice(-5);
                graph.series = [data.map((x) => x.price).slice(-5)];
                graph.data = data.map((x) => { return { x: new Date(x.dateTime), y: x.price } });
                this.setState({
                    stockgraph: stock,
                    graph: graph,
                })
            })
    }

    viewGraphButton = (name) => {
        return (
            <Button variant="contained" color="success"
                onClick={() => { this.getSingleStockGraph(name) }}
            >
                View Graph
            </Button>
        )
    }

    getAllStocks = () => {
        let tempCols = Object.entries(this.state.projectionColumns).filter((pair) => pair[1]);
        tempCols = tempCols.map((x) => x[0]);
        console.log(tempCols);
        requestGET(`/stocks`, { projections: tempCols })
            .then((res) => {
                console.log(res);
                if (res.data.length > 0) {
                    let data = res.data;
                    this.setState({
                        columnNames: Object.keys(data[0]),
                        values: data.map((x) => {
                            let name = x.name;
                            x = Object.values(x);
                            x.push(this.viewGraphButton(name));
                            return x;
                        })
                    })
                }
            })
    }

    componentDidMount() {
        this.getAllStocks();
    }

    handleSearchSubmit = (event) => {
        event.preventDefault();
        return requestGET(`/stocks/${this.state.stock}`)
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
                        title: `Stock not found!`
                    })
                }
            })
            .catch((err) => {
                console.log(err);
                helpers.Toast.fire({
                    icon: 'warning',
                    title: `${err.response.data}`
                })
            })
    }

    handleColumnChange = (event) => {
        let tempPC = this.state.projectionColumns;
        tempPC[event.target.value] = !tempPC[event.target.value];
        this.setState({
            projectionColumns: tempPC
        });
        this.getAllStocks();
    };

    handleStockBarChange = (event) => {
        const { name, value } = event.target;

        this.setState({ [name]: value });
    }

    handleCloseDialog = () => {
        this.setState({
            selectedStock: null,
            stockgraph: null
        })
        // this.getAllStocks();
    }

    handleTransactionSubmit = (event) => {
        console.log(event);
        event.preventDefault();
        if (this.state.transactionType === "buy") {
            return requestPOST(`/stocks/${this.state.selectedStock}/purchase`, { amount: this.state.qtyShares })
                .then(() => {
                    helpers.Toast.fire({
                        icon: 'success',
                        title: `Successfully purchased ${this.state.qtyShares} shares of ${this.state.selectedStock}`
                    })
                    this.props.handleGetAccountsInfo();
                })
                .catch((err) => {
                    helpers.Toast.fire({
                        icon: 'error',
                        title: `${err.response.data}`
                    })
                })
        } else if (this.state.transactionType === "sell") {
            return requestPOST(`/stocks/${this.state.selectedStock}/sell`, { amount: this.state.qtyShares })
                .then(() => {
                    helpers.Toast.fire({
                        icon: 'success',
                        title: `Successfully sold ${this.state.qtyShares} shares of ${this.state.selectedStock}`
                    })
                    this.props.handleGetAccountsInfo();
                })
                .catch((err) => {
                    helpers.Toast.fire({
                        icon: 'error',
                        title: `${err.response.data}`
                    })
                })
        }
        this.setState({
            qtyShares: 0
        })
    }

    render() {
        console.log(this.state)
        const { classes } = this.props;
        // this.projectedColumnNames = this.state.projectionColumns.filter((x) => this.state.projectionColumns[x]);
        this.stockColumns = (
            <React.Fragment>
                {Object.keys(this.state.projectionColumns).map((prop, key) => {
                    return (
                        <FormControlLabel
                            value={prop}
                            control={
                                <Checkbox
                                    defaultChecked
                                    onChange={(e) => { this.handleColumnChange(e) }}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            }
                            label={prop}
                            labelPlacement="start"
                        />

                    );

                })}
            </React.Fragment>
        );

        this.chartOptions = {
            animationEnabled: true,
            // title: {
            //     text: `Stock Chart: ${this.state.stockgraph}`,
            //     fontFamily: "Roboto"
            // },
            axisY: {
                valueFormatString: "$##0.00",
                minimum: Math.min(...this.state.graph.data.map((p) => p.y)) * 0.99,
            },
            data: [{
                type: "area",
                // xValueFormatString: "DD MMM",
                yValueFormatString: "$##0.00",
                dataPoints: this.state.graph.data
            }]
        }

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
                                    Please enter the number of stocks to trade:
                            </div>
                                <OutlinedInput type="number" size="small"
                                    endAdornment={<InputAdornment position="end">Shares</InputAdornment>}
                                    InputProps={{ inputProps: { min: 0 } }}
                                    required
                                    defaultValue={0}
                                    value={this.state.qtyShares}
                                    onChange={(e) => { this.setState({ qtyShares: e.target.value }) }}
                                />
                            </DialogContent>
                            <DialogActions>
                                <Button type="submit" color="success" className={classes.green}
                                    onClick={() => { this.setState({ transactionType: "buy" }) }}>
                                    Buy
                        </Button>
                                <Button type="submit" color="danger" className={classes.red}
                                    onClick={() => { this.setState({ transactionType: "sell" }) }}>
                                    Sell
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
                                <h4 className={classes.cardTitleWhite}>Trade Stocks</h4>
                                <p className={classes.cardCategoryWhite}>
                                    Search for a stock to trade:
                            </p>
                            </CardHeader>
                            {this.state.stockgraph != null
                                ?
                                <Dialog aria-labelledby="simple-dialog-title" onClose={this.handleCloseDialog}
                                    fullWidth={true}
                                    maxWidth={"lg"}
                                    // fullScreen={true}
                                    open={() => this.state.stockgraph != null}
                                    style={{
                                        height: '80vh',
                                        minHeight: '80vh',
                                        maxHeight: '80vh',
                                    }}
                                >
                                    <Card>
                                        <CardHeader color="primary" style={{ marginBottom: "15px" }}>
                                            <h3 className={classes.cardTitleWhite}>Stock Chart: {this.state.stockgraph}</h3>
                                        </CardHeader>
                                        <CanvasJSChart options={this.chartOptions} />
                                    </Card>
                                </Dialog>
                                : <div></div>
                            }
                            <React.Fragment>
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
                                    {this.stockColumns}
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
                            </React.Fragment>


                        </Card>
                    </GridItem>
                </GridContainer>
            </React.Fragment>
        );
    }
}

TradeStocks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TradeStocks);
