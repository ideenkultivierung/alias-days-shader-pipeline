import React from "react";
import "./App.css";
import Connection from "./components/connection/Connection";
import PresetSelection from "./components/preset-selection/PresetSelection";
import Baking from "./components/baking/Baking";
import MaterialMapping from "./components/material-mapping/MaterialMapper";
import Optimization from "./components/optimization/Optimization";
import Import from "./components/import/Import";
import { sendScript } from "./api/python-api-v1";
import { importLibrariesScript } from "./api/lib/import_libraries.js";
import * as PRESETS from "./presets/presets.js";

class App extends React.Component {
  state = {
    ip: "127.0.0.1",
    port: "8000",
    api: undefined,
    preset: "vr",
    importSettings: PRESETS.ATF_SETTINGS_VR,
    sceneSettings: PRESETS.SCENE_SETTINGS,
    bakingSettings: PRESETS.BAKING_SETTINGS_VR,
  };

  componentDidMount() {
    this.loadWebApiModule();
    this.importLibraries();
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

  importLibraries = async () => {
    const checkLibrariesAvailable = async () => {
      const response = await sendScript("MaterialMapper()", this.state.ip, this.state.port);
      return response && !response.includes("NameError");
    };

    const libaryAvailable = await checkLibrariesAvailable();

    if (!libaryAvailable) {
      console.log("Libraries are not yet injected...");
      sendScript(importLibrariesScript, this.state.ip, this.state.port)
        .then((data) => {
          console.log("Libraries are not yet injected...done");
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log("Libraries are already injected...");
    }
  };

  setConnectionParameters = (ip, port) => {
    this.setState(
      {
        ip: ip,
        port: port,
      },
      () => {
        this.loadWebApiModule();
        this.importLibraries();
      }
    );
  };

  setImportSettings = (importSettings) => {
    this.setState(importSettings);
  };

  setBakingSettings = (bakingSettings) => {
    this.setState(bakingSettings);
  };

  setPreset = (preset) => {
    this.setState({
      preset: preset,
    });
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

          {/* Preselection Module for Changing between VR, Preview and High Quality Settings */}
          <PresetSelection setPreset={this.setPreset} />
          <Import
            ip={this.state.ip}
            port={this.state.port}
            preset={this.state.preset}
            importSettings={this.state.importSettings}
            sceneSettings={this.state.sceneSettings}
          />

          {/* Optimization Module for merging nodes, groups etc. */}
          <Optimization ip={this.state.ip} port={this.state.port} />

          {/* Material Mapping Module to apply materials to the scene */}
          <MaterialMapping ip={this.state.ip} port={this.state.port} />

          {/* Baking Mapping Module to generate lightmaps */}
          {/* <Baking preset={this.state.preset} settings={this.state.bakingSettings} /> */}
        </div>
        <iframe
          title="streamContainer"
          className="stream"
          src={"http://" + this.state.ip + ":" + this.state.port + "/apps/VREDStream/index.html"}
        ></iframe>
      </div>
    );
  }
}

export default App;
