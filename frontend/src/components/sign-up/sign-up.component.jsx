import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

import "./sign-up.styles.scss";

const options = [
  { value: "None", label: "None" },
  { value: "Premium", label: "Premium" }
];

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      subscriptionType: "None"
    };
  }
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    const { username, email, password, password_confirmation, subscriptionType } = this.state;

    if (!/[A-Za-z0-9]+/.test(username)) {
      alert("Username must contain only characters and numbers!");
      return;
    }

    if (password !== password_confirmation) {
      alert("Passwords don't match");
      return;
    }

    if (password.length < 5 || 20 < password.length) {
      alert("Passwords must be between 5 and 20 characters");
      return;
    }

    axios
      .post(
        "http://localhost:4000/api/users/signup",
        {
          username,
          email,
          password,
          password_confirmation,
          subscriptionType
        },
        { withCreditential: true }
      )
      .then(res => {
        console.log("registration result: ", res);
        alert("You have successfully registered!");
        this.props.history.push("/signin");
      })
      .catch(error => {
        console.log("registration result: ", error.response);
        alert(error.response.data.error);
        this.setState({ username: "", email: "", password: "", password_confirmation: "", subscriptionType: "" });
      });
    event.preventDefault();
  };

  render() {
    console.log(this.state)
    const { username, email, password, password_confirmation, subscriptionType } = this.state;
    return (
      <div className="signup">
        <form onSubmit={this.handleSubmit}>
          <h1>Stock Trading Simulator</h1>
          <h2>Sign up</h2>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={this.handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
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

          <input
            type="password"
            name="password_confirmation"
            placeholder="Password Confirmation"
            value={password_confirmation}
            onChange={this.handleChange}
            required
          />

          <Select
            name="subscriptionType"
            placeholder="Type"
            value={this.state.subscriptionType}
            onChange={(val)=> this.setState({ subscriptionType: val })}
            options={options}
            classNamePrefix="select"
            className="test"
          />

          <button type="submit">Register</button>
          <p>
            Already have an account?{" "}
            <Link className="link" to="/signin">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    );
  }
}

export default SignUp;
