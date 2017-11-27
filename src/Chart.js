// vi: filetype=javascript.jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import { reverse } from "lodash/fp";
import {
  CartesianGrid,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default class Chart extends Component {
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
    const envelop = []
      .concat(limit.map(l => ({arm: l.fwd, weight: l.weight})))
      .concat(reverse(limit).map(l => ({arm: l.aft, weight: l.weight})));

    const armDomain = this._getArmDomain();
    const weightDomain = this._getWeightDomain();

    return (
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 10, left: -10 }}
        >
          <Scatter type="number" data={[fullCGPoint]} fill="#de3242" shape="diamond"/>
          <Scatter type="number" data={[emptyCGPoint]} fill="#de3242" shape="diamond"/>
          <XAxis type="number" dataKey="arm" name="CG" unit="inch" domain={armDomain}/>
          <YAxis type="number" dataKey="weight" name="weight" unit="lb" domain={weightDomain}/>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <ReferenceArea data={envelop} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  _getArmDomain () {
    const {fullCGPoint, emptyCGPoint, limit} = this.props;
    const arms = [fullCGPoint.arm, emptyCGPoint.arm].concat(limit.map(l => l.fwd)).concat(limit.map((l => l.aft)));
    const min = Math.min(...arms);
    const max = Math.max(...arms);
    const range = max - min;
    return [Math.floor(min - range / 10), Math.ceil(max + range / 10)];
  }

  _getWeightDomain () {
    const {fullCGPoint, emptyCGPoint, limit} = this.props;
    const weights = [fullCGPoint.weight, emptyCGPoint.weight].concat(limit.map(l => l.weight));
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const range = max - min;
    return [Math.floor(min - range / 10), Math.ceil(max + range / 10)];
  }
}
