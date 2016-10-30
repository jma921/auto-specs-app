import React, { Component } from 'react';
import Clipboard from 'clipboard';
import { Tooltip } from 'reactstrap';


class Specifications extends Component {
    constructor() {
        super()
        this.state = {
            tooltipOpen: null
        }
    }
    printWindow = (e) => {
        window.print();
    };
    toggleTooltip = (ms) => {
        // ms = length of timeout
        this.setState({
            tooltipOpen: true
        });
        setTimeout(() => {
            this.setState({
                tooltipOpen: null
            })
        }, ms)
    };
    copyToClipboard = (e) => {
        e.preventDefault();        
        const cap = `${this.props.year} ${this.props.make} ${this.props.model} ${this.props.engine} L\n Oil Cap: ${this.props.data.oilCap}\n Qts. Weight:${this.props.data.recWeight || '5W30'}\n Oil Filter: ${this.props.data.oilFilter}\n Air Filter: ${this.props.data.airFilter}\n Cabin Filter: ${this.props.data.cabinFilter}\n Wipers: ${this.props.data.wipers}\n Rear Wiper: ${this.props.data.rearWiper || 'None'}\n`;                
    };
    componentDidMount() {
        const clipboard = new Clipboard('#copyButton');
        clipboard.on('success', function(e) {
            this.toggleTooltip(2000);
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);

        e.clearSelection();
        }.bind(this));

        clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });
    }
    render() {
        const specs = this.props.data;
        let oilCap, recWeight, oilFilter, airFilter, cabinFilter, wipers, rearWiper, battery;         
        if (specs !== null) {
            oilCap = specs.oilCap ? `Oil Capacity: ${specs.oilCap}\n` : '';
            recWeight = specs.recWeight ? `Oil Weight: ${specs.recWeight}\n` : '';
            oilFilter = specs.oilFilter ? `Oil Filter: ${specs.oilFilter}\n` : '';
            airFilter = specs.airFilter ? `Air Filter: ${specs.airFilter}\n` : '';
            cabinFilter = specs.cabinFilter ? `Cabin Filter: ${specs.cabinFilter}\n` : '';
            wipers = specs.wipers ? `Wipers: ${specs.wipers}\n` : '';
            rearWiper = specs.rearWiper ? `Rear Wiper: ${specs.rearWiper}\n` : '';
            battery = specs.battery ? `Battery: ${specs.battery}\n` : '';
        }
        console.log(oilCap);        
        // // const copiedText = `${this.props.year} ${this.props.make} ${this.props.model} ${this.props.engine} L\nOil Cap: ${this.props.data.oilCap} Qts.\nWeight:${this.props.data.recWeight || '5W30'}\nOil Filter: ${this.props.data.oilFilter}\nAir Filter: ${this.props.data.airFilter}\nCabin Filter: ${this.props.data.cabinFilter}\nWipers: ${this.props.data.wipers}\nRear Wiper: ${this.props.data.rearWiper || 'None'}\nBattery: ${this.props.data.battery || null}`;
        const copiedText =  `${this.props.year} ${this.props.make} ${this.props.model} ${this.props.engine} L\n${oilCap}${oilFilter}${recWeight}${airFilter}${cabinFilter}${wipers}${rearWiper}${battery}`;
        return (
            <div className="col-xs-12">
                <div className="jumbotron mt-2">
                    <div className="row">
                        <h2 id="model" >{this.props.year} {this.props.make} {this.props.model} {this.props.engine} L</h2>
                        <h4 id="oilCap" className="lead"><em>Oil Capacity:</em> <strong>{specs.oilCap} Quarts</strong></h4>
                        <h4 id="recWeight" className="lead"><em>Oil Specification:</em> <strong>{specs.recWeight}</strong></h4>
                        <h4 id="oilFilter" className="lead"><em>Oil Filter:</em> <strong>{specs.oilFilter}</strong></h4>
                        {specs.airFilter ? <h4 id="airFilter" className="lead"><em>Air Filter:</em> <strong>{specs.airFilter}</strong></h4> : null}                
                        {specs.cabinFilter ? <h4 id="cabinFilter" className="lead"><em>Cabin Filter:</em> <strong>{specs.cabinFilter}</strong></h4> : null}
                        {specs.wipers ? <h4 id="wipers" className="lead"><em>Front Wipers:</em> <strong>{specs.wipers}</strong></h4> : null}
                        {specs.rearWiper ? <h4 id="" className="lead"><em>Rear Wiper:</em> <strong>{specs.rearWiper}</strong></h4> : null}
                        {specs.battery ? <h4 className="lead" id="battery"><em>Battery:</em> <strong>{specs.battery}</strong></h4> : null}
                    </div>                    
                    <button className="btn btn-success mr-1 hidden-print" onClick={this.printWindow}><i className="fa fa-print"></i> Print</button>
                    <button id="copyButton" className="btn btn-info hidden-print" onClick={this.copyToClipboard} data-clipboard-text={copiedText}><i className="fa fa-clipboard"></i> Copy To Clipboard</button>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="copyButton" >
                        Copied!
                    </Tooltip>                    
                </div>
            </div>
        );
    }
}

export default Specifications;