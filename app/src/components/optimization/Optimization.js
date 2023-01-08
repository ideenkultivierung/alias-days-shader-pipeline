import React from "react";
import { sendScript } from "../../api/python-api-v1";

class Optimization extends React.Component {
  optimizeSceneGraph = async () => {
    const script = `optimizeScene()`;
    await sendScript(script, this.props.ip, this.props.port);
  };

  render() {
    return (
      <div className="optimize-module-wrapper bg-container-single-line">
        <div className="title">Optimization</div>
        <button
          className="btn"
          type="button"
          onClick={() => this.optimizeSceneGraph()}
        >
          Optimize Scene Graph
        </button>
      </div>
    );
  }
}

export default Optimization;
