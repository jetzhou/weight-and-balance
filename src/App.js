// vi: filetype=javascript.jsx
import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import WeightAndBalance from "./weightAndBalance";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <WeightAndBalance
          tailNumber={"N999HE"}
          basicBody={{ weight: 1723.30, arm: 41.97 }}
          frontSeat={{ weight: 340, arm: 37.00 }}
          rearSeat={{ weight: 170, arm: 73.00 }}
          fuel={{ weight: 210, maxWeight: 318, arm: 48.00 }}
          baggage1={{ weight: 50, maxWeight: 120, arm: 95.00 }}
          baggage2={{ weight: 0, maxWeight: 50, arm: 123.00 }}
          basicWeight={{
            maxGrossTakeoff: 2550,
            maxRamp: 2558,
            maxLanding: 2550,
          }}
          normalLimit={[
            {weight: 1500, fwd: 35.00, aft: 47.25},
            {weight: 1950, fwd: 35.00, aft: 47.25},
            {weight: 2550, fwd: 41.00, aft: 47.25},
          ]}
          utilityLimit={[
            {weight: 1500, fwd: 35.00, aft: 40.50},
            {weight: 1950, fwd: 35.00, aft: 40.50},
            {weight: 2550, fwd: 37.50, aft: 40.50},
          ]}
        />
      </MuiThemeProvider>
    );
  }
}

export default App;
