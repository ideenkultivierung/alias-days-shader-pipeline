import React from "react";

class PresetSelection extends React.Component {
  state = {
    preset: "vr",
  };

  handlePresetChanged = (preset) => {
    this.setState({
      preset: preset,
    });
    this.props.setPreset(preset);
  };

  render() {
    return (
      <div className="preset-selection-module-wrapper bg-container-single-line">
        <div className="title">Workflow Preset</div>
        <select
          value={this.state.preset}
          onChange={(e) => this.handlePresetChanged(e.target.value)}
        >
          <option value="vr">VR</option>
          <option value="high">High</option>
          <option value="preview">Preview</option>
        </select>
      </div>
    );
  }
}

export default PresetSelection;
