import React from "react";
import { sendScript } from "./../../api/python-api-v1";

class Import extends React.Component {
  reimportFile = async () => {
    await sendScript("newScene()", this.props.ip, this.props.port);
    await sendScript("load('C:/alias_days_assets/ESPORT_GENTILE_Export.vpb')", this.props.ip, this.props.port);
  };

  render() {
    return (
      <div className="bg-container">
        <div className="title">File Import</div>
        <div className="component-submit-btn">
          <button type="button" className="btn component-submit-btn" onClick={() => this.reimportFile()}>
            Re-Import File
          </button>
        </div>
      </div>
    );
  }
}

export default Import;
