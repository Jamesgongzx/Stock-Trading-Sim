import React from "react";
// import { Redirect } from 'react-router';
import {Redirect, Route, Switch} from "react-router-dom";

import SignIn from "./components/sign-in/sign-in.component";
import SignUp from "./components/sign-up/sign-up.component";
// core components
import Admin from "./layouts/Admin";
import "./assets/css/material-dashboard-react.css?v=1.8.0";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            signed_in: false,
        };
    }

    handleSignIn = (state) => {
      this.setState({
          signed_in: state
      })
    };

    render() {
        // console.log(this.state)
        if (!this.state.signed_in) {
            return (
                <div className="App">
                    <Switch>
                        <Route exact path="/signin" render={routeProps => {
                            return <SignIn handleSignIn={this.handleSignIn} history={this.props.history}/>
                        }}/>
                        <Route exact path="/signup" component={SignUp}/>
                        <Redirect from="/" to="/signin"/>
                    </Switch>
                </div>
            )
        } else {
            return (
                <div className="App">
                    <Route path="/user" component={Admin} render={routerProps => {
                        return <Admin history={this.props.history}/>
                    }}/>
                    <Redirect from="/" to="/user"/>
                </div>
            )
        }
    }
}
export default App;
