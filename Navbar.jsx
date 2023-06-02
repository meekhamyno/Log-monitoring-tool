import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Navbar extends Component {
  handleSignout = () => {
    const data = { session_id: localStorage.getItem("session_id") };

    axios
      .post("http://127.0.0.1:8000/logout/", data)

      .then((response) => {
        if (response.data.status !== "failure") {
          localStorage.removeItem("session_id");
          localStorage.removeItem("token");
          window.location.href = "/";
        } else {
          console.log("error log", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <nav className="navbar bg-dark">
        <div className="container-fluid">
          <span className="navbar-brand text-white mb-0 h1">Log Monitor</span>
          {localStorage.getItem("token") ? (
            <div>
              <span className="text-white me-2">
                <i className="fa fa-light fa-user me-1"></i>
                {localStorage.getItem("token")}
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={this.handleSignout}
              >
                Signout
              </button>
            </div>
          ) : (
            <div>
              <Link to="/">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light me-2"
                >
                  Sign in
                </button>
              </Link>

              <Link to="/signup">
                <button type="button" className="btn btn-sm btn-light">
                  Sign up
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
  }
}

export default Navbar;
