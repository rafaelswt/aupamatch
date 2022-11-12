import React, { Component } from "react";
import { Row } from "react-bootstrap"
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";
import VagaCard from "./cardvaga.component";

export default class Vaga extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: [],
      currentIndex: -1,
      family: true,
      successful: false,
      loading: true,
      message: ""
    };
  }

  displayVaga = (vagas) => {
    if (!vagas.length) return "null";

    return vagas.map((vaga, index) => (
      <div key={index} >
        <h3>{vaga.filhos}</h3>
      </div>
    ))
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser.roles.toString() !== "ROLE_FAMILY") this.setState({ family: false });

    UserService.getVaga(currentUser).then(
      response => {
        this.setState({
          content: response.data,
          successful: true,
          message: "",
          loading:false
        });
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          loading: false,
          message: resMessage
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      },
    );
  }

  render() {

    const { content, currentIndex } = this.state;
    return (
      <div>
        {this.state.loading && (
          <div class="spinner-border m-5" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        )}
        {this.state.successful && (
          <div >
            <div className='row-wrapper'>
              <Row>
                {content.map(product => (
                  <VagaCard data={content} key={product.id} {...product} />
                ))}
              </Row>
            </div>

          </div>


        )}

        {this.state.message && (
          <div className="form-group">
            <div
              className={
                this.state.successful
                  ? "alert alert-success"
                  : "alert alert-danger"
              }
              role="alert"
            >
              {this.state.message}
            </div>
          </div>
        )}
      </div>


    );
  }
}