import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./sign-in.styles.scss";

class SignIn extends React.Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: ""
    };
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const { username, password } = this.state;
    axios
      .post(
        "http://localhost:4000/api/users/signin",
        {
          username,
          password
        },
        { withCreditential: true }
      )
      .then(result => {
        console.log("register result: ", result);
        alert("User has logged in successfully");
        this.setState({
          username: "",
          password: ""
        });
      })
      .catch(error => {
        console.log("register result: ", error.response);
        alert(error.response.data.error);
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
