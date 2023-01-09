import React from "react";
import "./App.css";
import Connection from "./components/connection/Connection";
import MaterialMapping from "./components/material-mapping/MaterialMapper";
import Import from "./components/import/Import";
import * as PRESETS from "./presets/presets.js";

class App extends React.Component {
  state = {
    ip: "127.0.0.1",
    port: "8888",
    api: undefined,
    importSettings: PRESETS.ATF_SETTINGS_VR,
    sceneSettings: PRESETS.SCENE_SETTINGS,
    bakingSettings: PRESETS.BAKING_SETTINGS_VR,
  };

  async componentDidMount() {
    await this.findLocalHost();
    this.loadWebApiModule();
  }

  findLocalHost() {
    return new Promise((resolve) => {
      let hostname = window.location.hostname;
      if (hostname === "localhost") {
        hostname = "127.0.0.1";
      }
      this.setState(
        {
          ip: hostname,
          port: this.state.port,
        },
        resolve()
      );
    });
  }

  loadWebApiModule = () => {
    console.log("Reload vred api module...");

    // remove old script tag
    const scriptElements = document.querySelectorAll("[vred-api]");
    for (let element of scriptElements) {
      element.remove();
    }

    // create new script tag
    const scriptCode =
      "import { api } from 'http://" + this.state.ip + ":" + this.state.port + "/api.js'; window.api = api;";
    var scriptTextNode = document.createTextNode(scriptCode);

    const script = document.createElement("script");
    script.setAttribute("vred-api", "true");
    script.type = "module";
    script.appendChild(scriptTextNode);
    document.body.appendChild(script);
    console.log("...finished", window.api);
  };

  setConnectionParameters = (ip, port) => {
    this.setState({
      ip: ip,
      port: port,
    });
  };

  setImportSettings = (importSettings) => {
    this.setState(importSettings);
  };

  render() {
    return (
      <div className="page">
        <div className="interface">
          {/* Connection Module - Setting IP and Port */}
          <Connection
            setConnectionParameters={this.setConnectionParameters}
            ip={this.state.ip}
            port={this.state.port}
          />
          <Import ip={this.state.ip} port={this.state.port} />

          {/* Material Mapping Module to apply materials to the scene */}
          <MaterialMapping ip={this.state.ip} port={this.state.port} />
        </div>
        <iframe
          title="streamContainer"
          className="stream"
          src={"http://" + this.state.ip + ":" + this.state.port + "/apps/VREDStream/index.html?width=1920&height=1080"}
        ></iframe>
      </div>
    );
  }
}

export default App;
