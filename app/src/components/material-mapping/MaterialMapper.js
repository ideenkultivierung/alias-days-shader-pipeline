import React from "react";
import "./MaterialMapper.css";
import { sendScript } from "../../api/python-api-v1";

class MaterialMapping extends React.Component {
  state = {
    materialLibrary: "aurora",
    materialMappingMode: "assetManager",
    rgbMappingFilePath: "D:/Development/autodesk-vred-developer-day/material_mappings/rgb-to-name.csv",
    nameMappingFilePath: "D:/Development/autodesk-vred-developer-day/material_mappings/name-to-name.csv",
  };

  materialLibraryMapping = {
    aurora: "D:/Development/autodeks-vred-developer-day-assets/Aurora/Aurora_MaterialAssets",
  };

  materialLibraryPath = () => {
    return this.materialLibraryMapping[this.state.materialLibrary];
  };

  applyMaterialsByExactNameMatching = async () => {
    const script = `MaterialMapper().applyMaterialMappingByExactName("${this.materialLibraryPath()}")`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  applyMaterialsByNameMapping = async () => {
    const script = `MaterialMapper().applyMaterialMappingByNames("${this.materialLibraryPath()}", "${
      this.state.nameMappingFilePath
    }")`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  applyMaterialsByRgbMapping = async () => {
    const script = `MaterialMapper().applyMaterialMappingByRgb("${this.materialLibraryPath()}", "${
      this.state.rgbMappingFilePath
    }")`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  materialLibraryOptions = () => {
    return <option value="aurora">Aurora Material Library</option>;
  };

  materialMappingModeOptions = () => {
    return [
      <option value="assetManager">Asset Manager Mapping</option>,
      <option value="colorMapping">RGB Mapping</option>,
      <option value="nameMapping">Name-to-Name Mapping</option>,
    ];
  };

  materialMappingSubmitButton = () => {
    let func, text;
    switch (this.state.materialMappingMode) {
      case "assetManager":
        func = this.applyMaterialsByExactNameMatching;
        text = "Apply Materials by Asset Manager";
        break;
      case "nameMapping":
        func = this.applyMaterialsByNameMapping;
        text = "Apply Materials by Name Mapping";
        break;
      case "colorMapping":
        func = this.applyMaterialsByRgbMapping;
        text = "Apply Materials by Color Mapping";
        break;
      default:
        return;
    }

    return (
      <button className="btn component-submit-btn" type="button" onClick={() => func()}>
        {text}
      </button>
    );
  };

  materialMappingInputGroup = () => {
    let parameter, state, text;
    switch (this.state.materialMappingMode) {
      case "nameMapping":
        parameter = this.state.nameMappingFilePath;
        state = (e) => {
          this.setState({ nameMappingFilePath: e.target.value });
        };
        text = "Name Mapping:";
        break;
      case "colorMapping":
        parameter = this.state.rgbMappingFilePath;
        state = (e) => {
          this.setState({ rgbMappingFilePath: e.target.value });
        };
        text = "Color Mapping:";
        break;
      default:
        return;
    }

    return (
      <div className="input-group">
        <label>{text}</label>
        <input type="text" value={parameter} title={parameter} onChange={state}></input>
      </div>
    );
  };

  render() {
    return (
      <div className="material-mapping-module-wrapper bg-container">
        <div className="title">Apply Materials</div>
        <div className="interface-group">
          {/* Select Material Library */}
          <div className="selection-group">
            <label>Material Library:</label>
            <select
              value={this.state.materialLibrary}
              onChange={(e) => {
                this.setState({ materialLibrary: e.target.value });
              }}
            >
              {this.materialLibraryOptions()}
            </select>
          </div>

          {/* Select Operation Mode */}
          <div className="selection-group">
            <label>Mapping Mode:</label>
            <select
              value={this.state.materialMappingMode}
              onChange={(e) => {
                this.setState({ materialMappingMode: e.target.value });
              }}
            >
              {this.materialMappingModeOptions()}
            </select>
          </div>

          {/* Apply material by name mapping */}
          {this.materialMappingInputGroup()}
        </div>
        <div>{this.materialMappingSubmitButton()}</div>
      </div>
    );
  }
}

export default MaterialMapping;
