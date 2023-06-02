import React, { Component } from "react";
import axios from "axios";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signupInfo: {
        email_id: "",
        name: "",
        password: "",
      },
      errorForSignupInfo: {
        email_id: "",
        name: "",
        password: "",
      },
    };
  }

  handleOnChangeSignup = (event) => {
    let signupInfo = { ...this.state.signupInfo };
    signupInfo[event.target.name] = event.target.value;

    this.setState({ signupInfo });
  };

  handleSignup = (event) => {
    event.preventDefault();

    axios
      .post("http://127.0.0.1:8000/register/", this.state.signupInfo)

      .then((response) => {
        if (response.data.status === "success") {
          window.location.href = "/";
        } else if (response.data.status === "failure") {
          let errorForSignupInfo = { ...this.state.errorForSignupInfo };
          if (response.data.reason === "User already exist") {
            errorForSignupInfo.email_id = "Email id already exists";
          }
          this.setState({ errorForSignupInfo });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { errorForSignupInfo } = this.state;

    return (
      <div className="container">
        <div className="row">
          <div className="col col-md-4 mx-auto">
            <h3 className="text-center mt-3">Sign-up with Log Monitor</h3>
            <div className="card mx-3 my-3">
              <div className="card-body mx-4 my-3">
                <form
                  className="needs-validation"
                  method="post"
                  onSubmit={this.handleSignup}
                >
                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">
                      Email id
                    </label>

                    <input
                      type="email"
                      name="email_id"
                      id="emailInput"
                      className={
                        errorForSignupInfo.email_id
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={this.handleOnChangeSignup}
                      required
                    />
                    <div className="invalid-feedback">
                      {errorForSignupInfo.email_id}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="nameInput" className="form-label">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      id="nameInput"
                      className={
                        errorForSignupInfo.name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={this.handleOnChangeSignup}
                      required
                    />
                    <div className="invalid-feedback">
                      {errorForSignupInfo.name}
                    </div>
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
                        errorForSignupInfo.password
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={this.handleOnChangeSignup}
                      required
                    />
                    <div className="invalid-feedback">
                      {errorForSignupInfo.password}
                    </div>
                  </div>

                  <div className="text-center my-3">
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary w-100"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
