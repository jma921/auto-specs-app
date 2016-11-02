import React, {Component} from 'react';

class HistoryVehicle extends Component {
    constructor() {
        super();
        this.state = {
            vehicle: ''
        }
    }
    searchVehicle = (e) => {
        e.preventDefault();                
        this.props.handleClick(this.props.data);
    };
    componentDidMount() {
        console.log(vehicle);
        const vehicle = this.props.data;
        const vehicleSplit = vehicle.split('/');
        const year = vehicleSplit[0];
        const make = vehicleSplit[1];
        const model = vehicleSplit[2];
        const engine = vehicleSplit[3].replace(',', '.');
        const vehicleString = `${year} ${make} ${model} ${engine} L`;
        this.setState({
            vehicle: vehicleString
        })
    }
    render() {
        return (
            <div>
                <div className="col-xs-3">
                    <button onClick={this.searchVehicle} className="btn btn-link">{this.state.vehicle}</button>
                </div>
            </div>
        );
    }
}

export default HistoryVehicle;