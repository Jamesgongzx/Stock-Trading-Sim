import React from "react";
// import { Redirect } from 'react-router';
import {Redirect, Route, Switch} from "react-router-dom";

import SignIn from "./components/sign-in/sign-in.component";
import SignUp from "./components/sign-up/sign-up.component";
// core components
import Admin from "./layouts/admin.jsx";
import "./assets/css/material-dashboard-react.css?v=1.8.0";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signed_in: false,
            username: null,
            email: null,
            accountId: null,
        };
    }

    changeProps = (data) => {
        console.log(data)
        this.setState(data);
    }

    handleSignIn = (state) => {
      this.setState({
          signed_in: state
      })
    };

    render() {
        if (!this.state.signed_in) {
            return (
                <div className="App">
                    <Switch>
                        <Route exact path="/signin" render={routeProps => {
                            return <SignIn handleSignIn={this.handleSignIn} history={this.props.history} changeProps={this.changeProps}/>
                        }}/>
                        <Route exact path="/signup" component={SignUp}/>
                        <Redirect from="/" to="/signin"/>
                    </Switch>
                </div>
            )
        } else {
            return (
                <div className="App">
                    <Route path="/user" render={routerProps => {
                        return <Admin {...this.state} {...this.props} {...routerProps} history={this.props.history} changeProps={this.changeProps}/>
                    }}/>
                    <Redirect from="/" to="/user"/>
                </div>
            )
        }
    }
}
export default App;
