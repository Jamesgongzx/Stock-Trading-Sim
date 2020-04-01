import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Select from '@material-ui/core/Select';

import "./sign-up.styles.scss";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

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
      subscriptionType: "Subscription Type",
    };
  }
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { username, email, password, password_confirmation, subscriptionType } = this.state;

    if ("None" !== subscriptionType && "Premium" !== subscriptionType) {
      alert("Subscription type must be selected!");
      return;
    }

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
        "http://localhost:4000/accounts/signup",
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
        alert(error.response.data);
        this.setState({ username: "", email: "", password: "", password_confirmation: "", subscriptionType: "" });
      });
    event.preventDefault();
  };

  render() {
    // console.log(this.state)
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
          <FormControl className="test">
          {/*<InputLabel htmlFor="age-native-required">Subscription Type</InputLabel>*/}
          <Select
            name="subscriptionType"
            // placeholder="Type"
            value={this.state.subscriptionType}
            onChange={(e, i, val)=> {
              console.log(e);
              this.setState({subscriptionType: e.target.value})
            }}
            // options={options}
            // classNamePrefix="select"
              displayEmpty
            // defaultValue="Subscription Type"
            className="test2"
          >
            <option value="Subscription Type" disabled selected>Subscription Type</option>
            <option value={"None"}>None</option>
            <option value={"Premium"}>Premium</option>
          </Select>
            {/*<FormHelperText>Placeholder</FormHelperText>*/}
          </FormControl>

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
