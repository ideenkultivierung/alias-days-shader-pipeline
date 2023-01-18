import React from "react";
import "./MaterialMapper.css";
import { sendScript } from "../../api/python-api-v1";

class MaterialMapping extends React.Component {
  state = {
    materialMappingMode: "assetManager",
    rgbMappingFilePath: "C:/alias-days-shader-pipeline/material_mappings/rgb-to-name.csv",
    nameMappingFilePath: "C:/alias-days-shader-pipeline/material_mappings/name-to-name.csv",
  };

  applyColorMapping = async () => {
    const script = `MaterialMapper().applyMaterialMappingByRgb("${this.state.rgbMappingFilePath}")`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  applyNameMapping = async () => {
    const script = `MaterialMapper().applyMaterialMappingByNames("${this.state.nameMappingFilePath}")`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  applyFuzzyNameMapping = async () => {
    const script = `MaterialMapper().applyMaterialMappingByNames("${this.state.nameMappingFilePath}", 0.25)`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  render() {
    return (
      <div className="material-mapping-module-wrapper bg-container">
        <div className="title">Material Mappings</div>
        <div>
          <div className="input-group">
            <label>RGB Mapping:</label>
            <button onClick={() => this.applyColorMapping()}>Apply Mapping</button>
          </div>
          <div className="input-group">
            <label>Name Mapping:</label>
            <button onClick={() => this.applyNameMapping()}>Apply Mapping</button>
          </div>
          <div className="input-group">
            <label>Fuzzy Mapping (90% Match):</label>
            <button onClick={() => this.applyFuzzyNameMapping()}>Apply Mapping</button>
          </div>
        </div>
      </div>
    );
  }
}

export default MaterialMapping;
