import React from "react";
// @material-ui/core components
import { makeStyles, withStyles } from "@material-ui/core/styles";
// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";
import Table from "../../components/Table/Table.js";
import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardBody from "../../components/Card/CardBody.js";
import PropTypes from 'prop-types';
import {requestGET} from "../../requests";
// import withStyles from "@material-ui/core/styles/withStyles";

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
    }
};

class MyStocks extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            columnNames : [],
            values: [],
        }
    }

    componentDidMount() {
        console.log(this.props)
        requestGET(`/players/${this.props.currentPlayer.playerId}/stocks`, )
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

    render() {
        const {classes} = this.props;
        return (
            <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                    <Card>
                        <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>My Stocks</h4>
                            <p className={classes.cardCategoryWhite}>
                                Here is a list of all the stocks for this player.
                            </p>
                        </CardHeader>
                        <CardBody>
                            <Table
                                tableHeaderColor="primary"
                                tableHead={this.state.columnNames}
                                tableData={this.state.values}
                            />
                        </CardBody>
                    </Card>
                </GridItem>
            </GridContainer>
        );
    }
}

MyStocks.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MyStocks);
