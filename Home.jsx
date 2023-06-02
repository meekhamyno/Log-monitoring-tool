import React, { Component } from "react";
import axios from "axios";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logList: [],
      filteredLogs: [],
      filter: "All Logs",
    };
  }

  getLogList = () => {
    const data = { session_id: localStorage.getItem("session_id") };
    axios
      .post("http://127.0.0.1:8000/get_all_logs/", data)

      .then((response) => {
        if (response.data.status !== "failure") {
          console.log("success log", response.data);
          this.setState({
            logList: response.data.logs,
            filteredLogs: response.data.logs,
          });
        } else {
          console.log("error log", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    this.getLogList();
    setInterval(this.getLogList, 30000);
  }

  handleOnChangeFilter = (event) => {
    this.setState({ filter: event.target.value });
  };

  handleFilter = (event) => {
    event.preventDefault();
    let filteredLogs = [];

    if (this.state.filter === "Info") {
      filteredLogs = this.state.logList.filter(
        (log) => log.level.toLowerCase() === "info"
      );
    } else if (this.state.filter === "Critical") {
      filteredLogs = this.state.logList.filter(
        (log) => log.level.toLowerCase() === "critical"
      );
    } else if (this.state.filter === "Error") {
      filteredLogs = this.state.logList.filter(
        (log) => log.level.toLowerCase() === "error"
      );
    } else if (this.state.filter === "Warning") {
      filteredLogs = this.state.logList.filter(
        (log) => log.level.toLowerCase() === "warning"
      );
    } else {
      filteredLogs = [...this.state.logList];
    }

    this.setState({ filteredLogs });
  };

  handleLog = (event, id) => {
    const data = {
      session_id: localStorage.getItem("session_id"),
      log_id: id,
      comment: "",
    };

    axios
      .post("http://127.0.0.1:8000/handle_log/", data)

      .then((response) => {
        if (response.data.status !== "failure") {
          this.getLogList();
        } else {
          console.log("error log", response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    const { filter, filteredLogs } = this.state;

    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    } else {
      return (
        <div className="container my-2">
          <form onSubmit={this.handleFilter}>
            <div className="row grey lighten-3">
              <div className="col-4 col-md-5 d-flex justify-content-end my-auto">
                <span className="">Filter by :</span>
              </div>

              <div className="col-4 col-md-2 my-auto">
                <select
                  className="form-select form-select-sm"
                  name="filter"
                  value={filter}
                  onChange={this.handleOnChangeFilter}
                >
                  <option value="All">All Logs</option>
                  <option value="Info">Info</option>
                  <option value="Critical">Critical</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                </select>
              </div>

              <div className="col-4 col-md-5 my-auto">
                <button type="submit" className="btn btn-sm btn-secondary">
                  Filter
                </button>
              </div>
            </div>
          </form>

          <div className="d-flex justify-content-end">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={this.getLogList}
            >
              Refresh
              <i className="fa fa-solid fa-rotate-right ms-1"></i>
            </button>
          </div>

          <div className="table-responsive my-2">
            <table className="table table-hover">
              <thead className="table-secondary">
                <tr>
                  <th scope="col" className="font-weight-bold">
                    Time Stamp
                  </th>
                  <th scope="col" className="font-weight-bold">
                    Application Name
                  </th>
                  <th scope="col">Level</th>
                  <th scope="col">Message</th>
                  <th scope="col">Handled By</th>
                  <th scope="col">Handled Time</th>
                  <th scope="col">Comment</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length < 1 ? (
                  <tr
                    colSpan="6"
                    className="d-flex justify-content-center text-muted my-4"
                  >
                    No logs found
                  </tr>
                ) : (
                  filteredLogs.map((item, index) => (
                    <tr key={index}>
                      <td>{item.timestamp}</td>
                      <td>{item.application_name}</td>
                      <td>{item.level}</td>
                      <td>{item.message}</td>
                      <td>
                        {item.handled_by === null ? (
                          <button
                            type="button"
                            className="btn btm-sm btn-link"
                            onClick={(event) => this.handleLog(event, item.id)}
                          >
                            handle yourself
                          </button>
                        ) : (
                          item.handled_by
                        )}
                      </td>
                      <td>{item.handled_time}</td>
                      <td>{item.comment}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  }
}

export default Home;
