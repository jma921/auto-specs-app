import React, {Component} from 'react';

class HistoryVehicle extends Component {

    searchVehicle = (e) => {
        e.preventDefault();                
        this.props.handleClick(this.props.link);
    };

    render() {
        
        return (
            <div className="col-xs-12 col-sm-4 col-md-3 hidden-print">
                <button onClick={this.searchVehicle} className="btn btn-link text-xs-center">{this.props.data}</button>
            </div>
        );
    }
}

export default HistoryVehicle;