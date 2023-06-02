import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfo: {
        email_id: "",
        password: "",
      },
      loginError: "",
    };
  }

  handleOnChangeLogin = (event) => {
    let loginInfo = { ...this.state.loginInfo };
    loginInfo[event.target.name] = event.target.value;

    this.setState({ loginInfo }, () => console.log(this.state.loginInfo));
  };

  handleLogin = (event) => {
    event.preventDefault();

    axios
      .post("http://127.0.0.1:8000/login/", this.state.loginInfo)

      .then((response) => {
        if (response.data.status === "success") {
          localStorage.setItem("session_id", response.data.session_id);
          localStorage.setItem("token", this.state.loginInfo.email_id);
          this.setState({ loginError: "" });

          window.location.href = "/home";
        } else if (response.data.status === "failure") {
          this.setState({ loginError: response.data.reason });
          console.log("error: ", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { loginError } = this.state;

    if (localStorage.getItem("token")) {
      window.location.href = "/home";
    } else {
      return (
        <div className="container">
          <div className="row">
            <div className="col col-md-4 mx-auto">
              <h3 className="text-center mt-3">Sign-in to Log Monitor</h3>
              <div className="card mx-3 my-3">
                <div className="card-body mx-4 my-3">
                  <form
                    className="needs-validation"
                    method="post"
                    onSubmit={this.handleLogin}
                  >
                    <div className="mb-3">
                      <label htmlFor="emailInput" className="form-label">
                        Email id
                      </label>

                      <input
                        type="text"
                        name="email_id"
                        id="emailInput"
                        className={
                          loginError
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={this.handleOnChangeLogin}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="passwordInput" className="form-label">
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        id="passwordInput"
                        className={
                          loginError
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={this.handleOnChangeLogin}
                        required
                      />
                      <div className="invalid-feedback">{loginError}</div>
                    </div>

                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="check"
                      />
                      <label className="form-check-label" htmlFor="check">
                        Remember me
                      </label>
                    </div>

                    <div className="text-center my-3">
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary w-100"
                      >
                        Sign in
                      </button>
                    </div>

                    <p className="fs-6 mt-3">
                      Don't have an account?
                      <Link to="/signup" className="ms-2">
                        Sign up
                      </Link>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Login;
