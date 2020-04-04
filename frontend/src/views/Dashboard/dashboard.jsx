import React from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Balance from '@material-ui/icons/AccountBalance';
import Store from "@material-ui/icons/Store";
import ShowChart from "@material-ui/icons/ShowChart";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";

// core components
import GridItem from "../../components/Grid/GridItem.js";
import GridContainer from "../../components/Grid/GridContainer.js";

import Card from "../../components/Card/Card.js";
import CardHeader from "../../components/Card/CardHeader.js";
import CardIcon from "../../components/Card/CardIcon.js";
import CardBody from "../../components/Card/CardBody.js";
import CardFooter from "../../components/Card/CardFooter.js";


import {
    dailySalesChart,
    emailsSubscriptionChart,
    completedTasksChart
} from "../../variables/charts.js";

import styles from "../../assets/jss/material-dashboard-react/views/dashboardStyle.js";
import PropTypes from "prop-types";
import {requestGET} from "../../requests";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stocks: 0,
        }
    }

    getStockCount = () => {
        requestGET("/stocks/stock-count")
            .then((results) => {
                console.log(results)
                if (results.data.length > 0) {
                    this.setState({
                        stocks: results.data[0].total
                    })
                }
            })
    };

    componentDidMount() {
        // this.getStockCount();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentPlayer !== this.props.currentPlayer) {
            // this.getStockCount();

        }
        // this.getStockCount();
    }

    render() {
        const {classes} = this.props;
        let money = (this.props.currentPlayer) ? this.props.currentPlayer.money : 0;
        // let stocks = requestGET("/stocks/stock-count")
        //     .then((results) => {
        //         console.log(results)
        //         if (results.data.length > 0) {
        //             return results.data[0].total
        //         }
        //         return 0;
        //     });
        return (
            <div>
                <GridContainer>
                    {/*<GridItem xs={12} sm={6} md={3}>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader color="warning" stats icon>*/}
                    {/*            <CardIcon color="warning">*/}
                    {/*                <Icon>content_copy</Icon>*/}
                    {/*            </CardIcon>*/}
                    {/*            <p className={classes.cardCategory}>Used Space</p>*/}
                    {/*            <h3 className={classes.cardTitle}>*/}
                    {/*                49/50 <small>GB</small>*/}
                    {/*            </h3>*/}
                    {/*        </CardHeader>*/}
                    {/*    </Card>*/}
                    {/*</GridItem>*/}
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="success" stats icon>
                                <CardIcon color="success">
                                    <Balance />
                                </CardIcon>
                                <p className={classes.cardCategory}>Current Money $</p>
                                <h3 className={classes.cardTitle}>${money}</h3>
                            </CardHeader>
                            <CardFooter stats>
                                {/*<div className={classes.stats}>*/}
                                {/*    <DateRange />*/}
                                {/*    Last 24 Hours*/}
                                {/*</div>*/}
                            </CardFooter>
                        </Card>
                    </GridItem>
                    <GridItem xs={12} sm={6} md={3}>
                        <Card>
                            <CardHeader color="warning" stats icon>
                                <CardIcon color="warning">
                                    <ShowChart />
                                </CardIcon>
                                <p className={classes.cardCategory}># Stocks Owned</p>
                                <h3 className={classes.cardTitle}>{this.props.stocks}</h3>
                            </CardHeader>
                            <CardFooter stats>
                                {/*<div className={classes.stats}>*/}
                                {/*    <DateRange />*/}
                                {/*    Last 24 Hours*/}
                                {/*</div>*/}
                            </CardFooter>
                        </Card>
                    </GridItem>
                    {/*<GridItem xs={12} sm={6} md={3}>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader color="danger" stats icon>*/}
                    {/*            <CardIcon color="danger">*/}
                    {/*                <Icon>info_outline</Icon>*/}
                    {/*            </CardIcon>*/}
                    {/*            <p className={classes.cardCategory}>Fixed Issues</p>*/}
                    {/*            <h3 className={classes.cardTitle}>75</h3>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardFooter stats>*/}
                    {/*            <div className={classes.stats}>*/}
                    {/*                <LocalOffer />*/}
                    {/*                Tracked from Github*/}
                    {/*            </div>*/}
                    {/*        </CardFooter>*/}
                    {/*    </Card>*/}
                    {/*</GridItem>*/}
                    {/*<GridItem xs={12} sm={6} md={3}>*/}
                    {/*    <Card>*/}
                    {/*        <CardHeader color="info" stats icon>*/}
                    {/*            <CardIcon color="info">*/}
                    {/*                <Accessibility />*/}
                    {/*            </CardIcon>*/}
                    {/*            <p className={classes.cardCategory}>Followers</p>*/}
                    {/*            <h3 className={classes.cardTitle}>+245</h3>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardFooter stats>*/}
                    {/*            <div className={classes.stats}>*/}
                    {/*                <Update />*/}
                    {/*                Just Updated*/}
                    {/*            </div>*/}
                    {/*        </CardFooter>*/}
                    {/*    </Card>*/}
                    {/*</GridItem>*/}
                </GridContainer>
                {/*<GridContainer>*/}
                {/*    <GridItem xs={12} sm={12} md={4}>*/}
                {/*        <Card chart>*/}
                {/*            <CardHeader color="success">*/}
                {/*                <ChartistGraph*/}
                {/*                    className="ct-chart"*/}
                {/*                    data={dailySalesChart.data}*/}
                {/*                    type="Line"*/}
                {/*                    options={dailySalesChart.options}*/}
                {/*                    listener={dailySalesChart.animation}*/}
                {/*                />*/}
                {/*            </CardHeader>*/}
                {/*            <CardBody>*/}
                {/*                <h4 className={classes.cardTitle}>Daily Sales</h4>*/}
                {/*                <p className={classes.cardCategory}>*/}
                {/*<span className={classes.successText}>*/}
                {/*  <ArrowUpward className={classes.upArrowCardCategory} /> 55%*/}
                {/*</span>{" "}*/}
                {/*                    increase in today sales.*/}
                {/*                </p>*/}
                {/*            </CardBody>*/}
                {/*            <CardFooter chart>*/}
                {/*                <div className={classes.stats}>*/}
                {/*                    <AccessTime /> updated 4 minutes ago*/}
                {/*                </div>*/}
                {/*            </CardFooter>*/}
                {/*        </Card>*/}
                {/*    </GridItem>*/}
                {/*    <GridItem xs={12} sm={12} md={4}>*/}
                {/*        <Card chart>*/}
                {/*            <CardHeader color="warning">*/}
                {/*                <ChartistGraph*/}
                {/*                    className="ct-chart"*/}
                {/*                    data={emailsSubscriptionChart.data}*/}
                {/*                    type="Bar"*/}
                {/*                    options={emailsSubscriptionChart.options}*/}
                {/*                    responsiveOptions={emailsSubscriptionChart.responsiveOptions}*/}
                {/*                    listener={emailsSubscriptionChart.animation}*/}
                {/*                />*/}
                {/*            </CardHeader>*/}
                {/*            <CardBody>*/}
                {/*                <h4 className={classes.cardTitle}>Email Subscriptions</h4>*/}
                {/*                <p className={classes.cardCategory}>Last Campaign Performance</p>*/}
                {/*            </CardBody>*/}
                {/*            <CardFooter chart>*/}
                {/*                <div className={classes.stats}>*/}
                {/*                    <AccessTime /> campaign sent 2 days ago*/}
                {/*                </div>*/}
                {/*            </CardFooter>*/}
                {/*        </Card>*/}
                {/*    </GridItem>*/}
                {/*    <GridItem xs={12} sm={12} md={4}>*/}
                {/*        <Card chart>*/}
                {/*            <CardHeader color="danger">*/}
                {/*                <ChartistGraph*/}
                {/*                    className="ct-chart"*/}
                {/*                    data={completedTasksChart.data}*/}
                {/*                    type="Line"*/}
                {/*                    options={completedTasksChart.options}*/}
                {/*                    listener={completedTasksChart.animation}*/}
                {/*                />*/}
                {/*            </CardHeader>*/}
                {/*            <CardBody>*/}
                {/*                <h4 className={classes.cardTitle}>Completed Tasks</h4>*/}
                {/*                <p className={classes.cardCategory}>Last Campaign Performance</p>*/}
                {/*            </CardBody>*/}
                {/*            <CardFooter chart>*/}
                {/*                <div className={classes.stats}>*/}
                {/*                    <AccessTime /> campaign sent 2 days ago*/}
                {/*                </div>*/}
                {/*            </CardFooter>*/}
                {/*        </Card>*/}
                {/*    </GridItem>*/}
                {/*</GridContainer>*/}
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
