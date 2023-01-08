import React from "react";
import * as PRESETS from "./../../presets/presets.js";

class Baking extends React.Component {
  state = {
    preset: this.props.preset,
    settings: { ...this.props.settings },
  };

  componentDidUpdate = (previousProps) => {
    if (this.props.preset !== previousProps.preset) {
      this.setState(
        {
          preset: this.props.preset,
        },
        () => {
          switch (this.state.preset) {
            case "vr":
              this.setState({
                settings: { ...PRESETS.BAKING_SETTINGS_VR },
              });
              break;
            case "high":
              this.setState({
                settings: { ...PRESETS.BAKING_SETTINGS_HIGH },
              });
              break;
            case "preview":
              this.setState({
                settings: { ...PRESETS.BAKING_SETTINGS_PREVIEW },
              });
              break;
            default:
              break;
          }
        }
      );
    }
  };

  bakeToTexture = () => {
    if (!window.api) {
      return;
    }
    // Filter for geometry nodes
    window.api.vrNodeService.findNodes("*", true).then((nodes) => {
      const geometryNodes = nodes.filter(
        (node) => node.type === "vrdGeometryNode"
      );

      window.api.vrBakeService
        .bakeToTexture(
          geometryNodes,
          this.state.settings.illuminationSettings,
          this.state.settings.textureBakeSettings
        )
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.error(error));
    });
  };

  samplesSettingChanged = (value) => {
    const settings = { ...this.state.settings };
    settings.textureBakeSettings.samples = parseInt(value);
    this.setState({
      settings,
    });
  };

  indirectionsSettingChanged = (value) => {
    const settings = { ...this.state.settings };
    settings.illuminationSettings.samples = parseInt(value);
    this.setState({
      settings,
    });
  };

  render() {
    return (
      <div className="baking-module-wrapper bg-container">
        <div className="title">Lightmap Baking</div>
        <div className="interface-group">
          <div>
            <div className="input-group">
              <label>Sample Size</label>
              <input
                type="number"
                value={this.state.settings.textureBakeSettings.samples}
                onChange={(e) => this.samplesSettingChanged(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="input-group">
            <label>Indirections</label>
            <input
              type="number"
              value={this.state.settings.illuminationSettings.indirections}
              onChange={(e) => this.indirectionsSettingChanged(e.target.value)}
            ></input>
          </div>
        </div>
        <div className="component-submit-btn">
          <button
            type="button"
            className="btn"
            onClick={() => this.bakeToTexture()}
          >
            Bake Lightmaps
          </button>
        </div>
      </div>
    );
  }
}

export default Baking;
