import React from "react";
import * as PRESETS from "./../../presets/presets.js";
import * as FILE_TYPES from "./../../presets/data-types.js";

class Import extends React.Component {
  state = {
    filepath: undefined,
    preset: this.props.preset,
    importSettings: this.props.importSettings,
    sceneSettings: this.props.sceneSettings,
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
                importSettings: PRESETS.ATF_SETTINGS_VR,
                sceneSettings: PRESETS.SCENE_SETTINGS,
              });
              break;
            case "high":
              this.setState({
                importSettings: PRESETS.ATF_SETTINGS_HIGH,
                sceneSettings: {},
              });
              break;
            case "preview":
              this.setState({
                importSettings: PRESETS.ATF_SETTINGS_PREVIEW,
                sceneSettings: PRESETS.SCENE_SETTINGS,
              });
              break;
            default:
              break;
          }
        }
      );
    }
  };

  import = async () => {
    await window.api.vrFileIOService.setSceneImportSettings(
      this.state.sceneSettings
    );
    await window.api.vrFileIOService.setSceneImportSettings(
      FILE_TYPES.FileType_FBX,
      this.state.importSettings
    );
    await window.api.vrFileIOService
      .loadFile(this.state.filepath)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.error(error));
  };

  onFileChangedHandle = (filepath) => {
    this.setState({
      filepath,
    });
  };

  importSettingChanged = (value, key) => {
    if (value === "true" || value === "false") {
      // Convert value to boolean
      value = !!value;
    } else {
      // Otherweise convert value to float
      value = parseFloat(value);
    }

    const importSettings = ({ ...this.props.importSettings }[key] = value);
    this.setState({
      importSettings,
    });
  };

  render() {
    return (
      <div className="bg-container">
        <div className="title">File Import</div>
        <div className="interface-group">
          <div className="import-input-group">
            <input
              type="text"
              multiple="multiple"
              placeholder="Enter the path to your VRED file..."
              onChange={(e) => this.onFileChangedHandle(e.target.value)}
            ></input>
          </div>

          {/* Stitching */}
          <div className="checkbox-group">
            <label>Stitching</label>
            <input
              type="checkbox"
              value={this.state.importSettings.useStitching}
              onChange={(e) =>
                this.importSettingChanged(e.target.value, "useStitching")
              }
            ></input>
          </div>

          {/* Chord Deviation */}
          <div className="input-group">
            <label>Chord Deviation</label>
            <input
              type="number"
              value={this.state.importSettings.chordDeviation}
              onChange={(e) =>
                this.importSettingChanged(e.target.value, "chordDeviation")
              }
            ></input>
          </div>

          {/* Normal Tolerance */}
          <div className="input-group">
            <label>Normal Tolerance</label>
            <input
              type="number"
              value={this.state.importSettings.normalTolerance}
              onChange={(e) =>
                this.importSettingChanged(e.target.value, "normalTolerance")
              }
            ></input>
          </div>
        </div>
        <div className="component-submit-btn">
          <button
            type="button"
            className="btn component-submit-btn"
            onClick={() => this.import()}
          >
            Import File
          </button>
        </div>
      </div>
    );
  }
}

export default Import;
