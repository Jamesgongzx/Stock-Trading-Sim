import React from "react";
import { Switch, Route } from "react-router-dom";

import SignIn from "./components/sign-in/sign-in.component";
import SignUp from "./components/sign-up/sign-up.component";

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
        console.log(this.state)
        return (
            <div className="App">
                <Switch>
                    <Route exact path="/signin" render={ routeProps => {
                        return <SignIn handleSignIn={this.handleSignIn}/>
                    }} />
                    <Route exact path="/signup" component={SignUp} />
                </Switch>
            </div>
        )
    }
}
export default App;
