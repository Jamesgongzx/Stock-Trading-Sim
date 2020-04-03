import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./sign-in.styles.scss";
import {requestPOST} from "../../requests";

class SignIn extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
    };
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const { username, password } = this.state;
    requestPOST("/accounts/signin", {username, password})
      .then(result => {
        console.log("register result: ", result);
        // alert("User has logged in successfully");
        this.setState({
          username: "",
          password: "",
        });
        this.props.changeProps({
          username: result.data.username,
          email: result.data.email,
          accountId: result.data.accountId,
          admin: result.data.admin,
          signed_in: true
        });
        this.props.history.push("/user/dashboard");
      })
      .catch(error => {
        console.log("register result: ", error);
        this.props.handleSignIn(false);
        alert(error.response.data);
      });
    event.preventDefault();
  };

  render() {
    const { username, password } = this.state;
    return (
      <div className="signin">
        <form onSubmit={this.handleSubmit}>
          <h1>Stock Trading Simulator</h1>
          <h2>Sign in</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={this.handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleChange}
            required
          />

          <button className="submit" type="submit">
            Sign In
          </button>

          <Link className="link" to="/signup">
            Create an account
          </Link>
        </form>
      </div>
    );
  }
}

export default SignIn;
