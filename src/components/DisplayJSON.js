import React from "react";

class DisplayJSON extends React.Component {
  render() {
    return (
      <div>
        <pre>
          {JSON.stringify(this.props.data, null, 2) }
        </pre>
      </div>
      );
    }
  }
  
 export default DisplayJSON;