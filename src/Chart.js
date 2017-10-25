// vi: filetype=javascript.jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ScatterChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Scatter,
  ReferenceArea,
} from "recharts";

class Chart extends Component {
  static propTypes = {
    limit: PropTypes.arrayOf(PropTypes.shape({
      weight: PropTypes.number.isRequired,
      fwd: PropTypes.number.isRequired,
      aft: PropTypes.number.isRequired,
    })).isRequired,
    fullCGPoint: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    emptyCGPoint: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      arm: PropTypes.number.isRequired,
    }).isRequired,
  }

  render () {
    const {fullCGPoint, emptyCGPoint, limit} = this.props;
    const envelop = [
      {arm: limit[0].fwd, weight: limit[0].weight},
      {arm: limit[1].fwd, weight: limit[1].weight},
      {arm: limit[2].fwd, weight: limit[2].weight},
      {arm: limit[2].aft, weight: limit[2].weight},
      {arm: limit[1].aft, weight: limit[1].weight},
      {arm: limit[0].aft, weight: limit[0].weight},
    ];

    return (
       <ScatterChart
         width={500}
         height={500}
         margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
       >
         <Scatter type="number" data={[fullCGPoint]} fill="#de3242" shape="diamond"/>
         <Scatter type="number" data={[emptyCGPoint]} fill="#de3242" shape="diamond"/>
         <XAxis type="number" dataKey="arm" name="CG" unit="inch" domain={[34, 48]}/>
         <YAxis type="number" dataKey="weight" name="weight" unit="lb" domain={[1400, 2600]}/>
         <CartesianGrid strokeDasharray="3 3" />
         <Tooltip cursor={{ strokeDasharray: '3 3' }} />
         <ReferenceArea data={envelop} fill="#8884d8" />
       </ScatterChart>
    );
  }
}

export default Chart;
