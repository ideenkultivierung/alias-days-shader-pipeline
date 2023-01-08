import React from "react";
import "./Connection.css";

class Connection extends React.Component {
  state = {
    ip: this.props.ip,
    port: this.props.port,
  };

  handleInputIp = (event) => {
    this.setState({
      ip: event.target.value,
    });
  };

  handleInputPort = (event) => {
    this.setState({
      port: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.setConnectionParameters(this.state.ip, this.state.port);
  };

  render() {
    return (
      <div className="control-wrapper">
        <div className="control-inputs">
          <input
            type="text"
            placeholder="IP Address"
            value={this.state.ip}
            onChange={this.handleInputIp}
          />
          <input
            type="text"
            placeholder="Port"
            value={this.state.port}
            onChange={this.handleInputPort}
          />
        </div>
        <button type="button" className="btn" onClick={this.handleSubmit}>
          Connect
        </button>
      </div>
    );
  }
}

export default Connection;
