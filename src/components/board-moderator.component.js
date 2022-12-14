import React, { Component } from "react";

import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";

export default class BoardModerator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    UserService.getModeratorBoard(currentUser.email).then(
      response => {
        this.setState({
          content: JSON.stringify(response.data)
        });
      },
      error => {
        this.setState({
          content:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>{this.state.content}</h3>
        </header>
      </div>
    );
  }
}
