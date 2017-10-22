// vi: filetype=javascript.jsx
import React, { Component } from "react";
import { reduce, set, toNumber } from "lodash/fp";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from "material-ui/Table";
import Slider from "material-ui/Slider";
import TextField from "material-ui/TextField";

class WeightAndBalance extends Component {
  static propTypes = {
    tailNumber: PropTypes.string.isRequired,
    basicBody: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    frontSeat: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      maxWeight: PropTypes.number,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    rearSeat: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      maxWeight: PropTypes.number,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    fuel: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      maxWeight: PropTypes.number.isRequired,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    baggage1: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      maxWeight: PropTypes.number.isRequired,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    baggage2: PropTypes.shape({
      weight: PropTypes.number.isRequired,
      maxWeight: PropTypes.number.isRequired,
      arm: PropTypes.number.isRequired,
    }).isRequired,
    basicWeight: PropTypes.shape({
      empty: PropTypes.number.isRequired,
      maxGrossTakeoff: PropTypes.number.isRequired,
      maxRamp: PropTypes.number.isRequired,
      maxLanding: PropTypes.number.isRequired,
    }).isRequired,
    normalLimit: PropTypes.arrayOf(PropTypes.shape({
      weight: PropTypes.number.isRequired,
      fwd: PropTypes.number.isRequired,
      aft: PropTypes.number.isRequired,
    })).isRequired,
    utilityLimit: PropTypes.arrayOf(PropTypes.shape({
      weight: PropTypes.number.isRequired,
      fwd: PropTypes.number.isRequired,
      aft: PropTypes.number.isRequired,
    })).isRequired,
  }

  constructor (props) {
    super(props);
    this.state = {
      parts: {
        basicBody: {...props.basicBody},
        frontSeat: {...props.frontSeat},
        rearSeat: {...props.rearSeat},
        fuel: {...props.fuel},
        baggage1: {...props.baggage1},
        baggage2: {...props.baggage2},
      },
      total: { maxWeight: props.maxWeight },
      fuelInPounds: true,
    };
  }

  render() {
    const totalWeight = reduce((sum, {weight}) => sum + weight, 0, this.state.parts);
    const totalMoment = reduce((sum, {weight, arm}) => sum + weight * arm, 0, this.state.parts);
    const totalArm = totalMoment / totalWeight;

    return (
      <div>
        <div>
          {this._renderSlider("frontSeat")}
          {this._renderSlider("rearSeat")}
          {this._renderSlider("fuel")}
          {this._renderSlider("baggage1")}
          {this._renderSlider("baggage2")}
        </div>
        <div>
          <Table>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
              <TableRow>
                <TableHeaderColumn></TableHeaderColumn>
                <TableHeaderColumn>Weight</TableHeaderColumn>
                <TableHeaderColumn>Max Weight</TableHeaderColumn>
                <TableHeaderColumn>Arm</TableHeaderColumn>
                <TableHeaderColumn>Moment</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {this._renderRow("Basic Body", this.state.parts.basicBody)}
              {this._renderRow("Front Seat", this.state.parts.frontSeat)}
              {this._renderRow("Rear Seat", this.state.parts.rearSeat)}
              {this._renderRow("Fuel", this.state.parts.fuel)}
              {this._renderRow("Baggage1", this.state.parts.baggage1)}
              {this._renderRow("Baggage2", this.state.parts.baggage2)}
              {this._renderRow("Total", {
                weight: totalWeight,
                maxWeight: this.props.basicWeight.maxGrossTakeoff,
                arm: totalArm,
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  _renderSlider(part) {
    const weight = this.state.parts[part].weight;
    const max = this.state.parts[part].maxWeight || 600;
    const onChange = (event, value) => this.setState(set(`parts.${part}.weight`, toNumber(value)));
    return (
      <div>
        <Slider
          defaultValue={weight}
          value={weight}
          min={0}
          max={max}
          step={1}
          onChange={onChange}
        />
        <TextField
          id={`${part}Input`}
          value={weight}
          onChange={onChange}
        />
      </div>
    )
  }

  _renderRow(item, {weight, maxWeight, arm}) {
    return (
      <TableRow>
        <TableRowColumn>{item}</TableRowColumn>
        <TableRowColumn>{weight}</TableRowColumn>
        <TableRowColumn>{maxWeight}</TableRowColumn>
        <TableRowColumn>{arm.toFixed(2)}</TableRowColumn>
        <TableRowColumn>{(weight * arm).toFixed(0)}</TableRowColumn>
      </TableRow>
    );
  }
}

export default WeightAndBalance;
