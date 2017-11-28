// vi: filetype=javascript.jsx
import React, { Component } from "react";
import PropTypes from "prop-types";
import { omit, reduce, set, toNumber } from "lodash/fp";
import { round } from "lodash";

import "./WeightAndBalance.css";

import Chart from "./Chart";
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Slider from "material-ui/Slider";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from "material-ui/Table";
import TextField from "material-ui/TextField";

const POUNDS_PER_GALLON_100LL = 6;
const POUNDS_PER_GALLON_JET_FUEL = 6.7;
const DEFAULT_MAX_WEIGHT = 600;

export default class WeightAndBalance extends Component {
  static propTypes = {
    tailNumber: PropTypes.string.isRequired,
    jetFuel: PropTypes.bool,
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
      fuelUnit: "lb",
      poundsPerGallon: props.jetFuel ? POUNDS_PER_GALLON_JET_FUEL : POUNDS_PER_GALLON_100LL,
    };
  }

  render() {

    const totalWeight = reduce((sum, {weight}) => sum + weight, 0, this.state.parts);
    const totalMoment = reduce((sum, {weight, arm}) => sum + weight * arm, 0, this.state.parts);
    const totalArm = totalMoment / totalWeight;

    const emptyWeight = reduce((sum, {weight}) => sum + weight, 0, omit("fuel", this.state.parts));
    const emptyMoment = reduce((sum, {weight, arm}) => sum + weight * arm, 0, omit("fuel", this.state.parts));
    const emptyArm = emptyMoment / emptyWeight;

    return (
      <div>
        <div>
          <div id="inputs">{this._renderInputs()}</div>
          <div id="chart">
            <Chart
              limit={this.props.normalLimit}
              fullCGPoint={{ weight: totalWeight, arm: round(totalArm, 2) }}
              emptyCGPoint={{ weight: emptyWeight, arm: round(emptyArm, 2) }}
            />
          </div>
          <div style={{clear: "both"}} />
        </div>
        <div id="table">{this._renderTable(totalWeight, totalArm)}</div>
      </div>
    )
  }

  _renderInputs() {
    return (
      <div>
        {this._renderSlider("frontSeat", "Front Seat")}
        {this._renderSlider("rearSeat", "Rear Seat")}
        {this._renderSlider("fuel", "Fuel")}
        {this._renderSlider("baggage1", "Baggage1")}
        {this._renderSlider("baggage2", "Baggage2")}
      </div>
    );
  }

  _renderSlider(part, name) {
    const { poundsPerGallon, fuelUnit } = this.state;
    const isFuelInGallon = part === "fuel" && fuelUnit === "gal";

    let val = this.state.parts[part].weight;
    let maxVal = this.state.parts[part].maxWeight || DEFAULT_MAX_WEIGHT;
    if (isFuelInGallon) {
      val = Math.floor(val / poundsPerGallon);
      maxVal = Math.floor(maxVal / poundsPerGallon);
    }

    const onChange = (event, value) => {
      value = toNumber(value);
      if (isFuelInGallon) {
        value *= poundsPerGallon;
      }
      this.setState(set(`parts.${part}.weight`, value));
    };

    return (
      <div className="sliderContainer">
        <div className="name">{name}</div>
        <div
          className="adjustment"
          style={{
            paddingRight: part === "fuel" ? "95px" : "0px",
            position: "relative",
          }} 
        >
          <Slider
            style={{ width: "100%", float: "left" }}
            value={val}
            min={0}
            max={maxVal}
            step={1}
            onChange={onChange}
          />
          {part === "fuel" &&
            <RadioButtonGroup
              style={{ position: "absolute", right: "0px", top: "20px", fontSize: "small" }}
              name="fuelUnit"
              onChange={(event, val) => this.setState({fuelUnit: val})}
              valueSelected={fuelUnit}
            >
              <RadioButton
                style={{ float: "left", width: "auto", marginRight: "6px" }}
                iconStyle={{ marginRight: "2px"}}
                label="lb"
                value="lb"
              />
              <RadioButton
                style={{ float: "left", width: "auto" }}
                iconStyle={{marginRight: "2px"}}
                label="gal"
                value="gal"
              />
            </RadioButtonGroup>
          }
        </div>
        <div className="value">
          <TextField
            style={{width: "65%"}}
            inputStyle={{textAlign: "center"}}
            id={`${part}Input`}
            value={val}
            onChange={onChange}
          />
          <span>{part === "fuel" ? this.state.fuelUnit : "lb"}</span>
        </div>
      </div>
    )
  }

  _renderTable(totalWeight, totalArm) {
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
          <TableRow>
            <TableHeaderColumn></TableHeaderColumn>
            <TableHeaderColumn>Weight</TableHeaderColumn>
            <TableHeaderColumn className="hiddable">Max Weight</TableHeaderColumn>
            <TableHeaderColumn>Arm</TableHeaderColumn>
            <TableHeaderColumn className="hiddable">Moment</TableHeaderColumn>
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
    );
  }

  _renderRow(item, {weight, maxWeight, arm}) {
    return (
      <TableRow>
        <TableRowColumn>{item}</TableRowColumn>
        <TableRowColumn>{weight}</TableRowColumn>
        <TableRowColumn className="hiddable">{maxWeight}</TableRowColumn>
        <TableRowColumn>{arm.toFixed(2)}</TableRowColumn>
        <TableRowColumn className="hiddable">{(weight * arm).toFixed(0)}</TableRowColumn>
      </TableRow>
    );
  }
}
