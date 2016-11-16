import React, { Component } from 'react';
import base from './utils/base';
import Clipboard from 'clipboard';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from 'reactstrap';


class Specifications extends Component {
    constructor() {
        super()
        this.state = {
            tooltipOpen: null,
            modal: false,
            showSuccess: false,
            showError: false
        }
    }
    printWindow = (e) => {
        window.print();
    };
    reportError = (e) => {
        e.preventDefault();
        // this.props.handleClick();
        alert('This will do something one day.');
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
    toggleModal = () => {
        this.setState({
            modal: !this.state.modal
        })
    };
    submitErrorForm = (e) => {
        console.log(e);
        e.preventDefault();        
        const name = this.refs.name.value;
        const errorReported = `${this.props.year} ${this.props.make} ${this.props.model} ${this.props.engine} ${this.refs.errorReported.value}`;
        if (!name && !errorReported) {
            this.setState({
                showError: "Please enter your name and the error."
            })
            return;
        } 
        if (!name) {
            this.setState({
                showError: "Please enter your name."
            })
            return;
        }    
        if (!errorReported) {
            this.setState({
                showError: "Please enter your error."
            })
            return;
        }   
        
        console.log(name, errorReported);
        this.refs.name.value = '';
        this.refs.errorReported.value = '';
        const timestamp = Date.now();
        const key = -Math.abs(Date.now());
        base.push('messages', {
            data: { name: name, error: errorReported, timestamp: timestamp, key: key}
        }).then(newLocation => {
            const generatedKey = newLocation.key;
            this.setState({
                showSuccess: 'Thanks for your input. This box will close in 3 seconds.'
            })
        }).catch(err => {
            console.log(err);
        })
        setTimeout(() => {
            this.setState({
                modal: false,
                showSuccess: null,
                showError: null
            })
        }, 3000)
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
        const copiedText =  `${this.props.year} ${this.props.make} ${this.props.model} ${this.props.engine} L\n${oilCap}${oilFilter}${recWeight}${airFilter}${cabinFilter}${wipers}${rearWiper}${battery}`;
        return (
            <div className="col-xs-12">
                <div className="jumbotron mt-2">
                    <div className="">
                        <h2 id="model" >{this.props.year} {this.props.make} {this.props.model} {this.props.engine} L</h2>
                        <h4 id="oilCap" className="lead"><em>Oil Capacity:</em> <strong>{specs.oilCap} Quarts</strong></h4>
                        <h4 id="recWeight" className="lead"><em>Oil Specification:</em> <strong>{specs.recWeight}</strong></h4>
                        <h4 id="oilFilter" className="lead"><em>Oil Filter:</em> <strong>{specs.oilFilter}</strong></h4>
                        {specs.airFilter ? <h4 id="airFilter" className="lead"><em>Air Filter:</em> <strong>{specs.airFilter}</strong></h4> : null}                
                        {specs.cabinFilter ? <h4 id="cabinFilter" className="lead"><em>Cabin Filter:</em> <strong>{specs.cabinFilter}</strong></h4> : null}
                        {specs.wipers ? <h4 id="wipers" className="lead"><em>Front Wipers:</em> <strong>{specs.wipers}</strong></h4> : null}
                        {specs.rearWiper ? <h4 id="" className="lead"><em>Rear Wiper:</em> <strong>{specs.rearWiper}</strong></h4> : null}
                        {specs.battery ? <h4 className="lead" id="battery"><em>Battery:</em> <strong>{specs.battery}</strong></h4> : null}
                        {specs.oilReset ? <h4 className="lead" id="oilReset"><em>Oil Reset: </em><small>{specs.oilReset}</small></h4> : null}
                    </div>                    
                    <button id="printSpecs" className="btn btn-success mr-1 hidden-print" onClick={this.printWindow}><i className="fa fa-print"></i> Print</button>                    
                    <button id="copyButton" className="btn btn-info hidden-print" onClick={this.copyToClipboard} data-clipboard-text={copiedText}><i className="fa fa-clipboard"></i> Copy To Clipboard</button>
                    <div className="col-xs">
                        <button className="btn btn-link hidden-print" onClick={this.toggleModal}>Report An Error</button>
                    </div>
                    <Tooltip placement="top" isOpen={this.state.tooltipOpen} target="copyButton" >
                        Copied!
                    </Tooltip>                    
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Report An Error</ModalHeader>
                        <ModalBody>
                            <p>Please enter your name and describe the error.</p>
                            <form onSubmit={this.submitErrorForm}>
                                <div className="form-group">
                                    <label htmlFor="name" className="control-label">Name</label>
                                    <input className="form-control" type="text" name="name" ref="name" />
                                </div>    
                                <div className="form-group">
                                    <label htmlFor="errorReported">Error</label>
                                    <textarea rows="3" className="form-control" type="text" name="errorReported" ref="errorReported" />
                                </div>                                                                                            
                            </form>
                            {
                                this.state.showSuccess ? <div className="alert alert-success"><p><strong>Success!</strong> {this.state.showSuccess}</p></div> : null
                            }
                            {
                                this.state.showError ? <div className="alert alert-danger"><p><strong>Error!</strong> {this.state.showError}</p></div> : null
                            }
                        </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitErrorForm}>Submit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Specifications;