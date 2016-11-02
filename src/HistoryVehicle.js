import React, {Component} from 'react';

class HistoryVehicle extends Component {

    searchVehicle = (e) => {
        e.preventDefault();                
        this.props.handleClick(this.props.link);
    };

    render() {
        
        return (
            <div>
                <div className="col-xs-3">
                    <button onClick={this.searchVehicle} className="btn btn-link">{this.props.data}</button>
                </div>
            </div>
        );
    }
}

export default HistoryVehicle;