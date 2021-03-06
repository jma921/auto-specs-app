import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import base from  './utils/base';
import {formatEngine} from './utils/helpers'; 
import loadingSpinner from './spinning-bubbles.svg';
import Specifications from './Specifications';
import HistoryVehicle from './HistoryVehicle';
import Messages from './Messages';

var options = [
    { value: '2016', label: '2016' },
    { value: '2015', label: '2015' },
    { value: '2014', label: '2014' },
    { value: '2013', label: '2013' },
    { value: '2012', label: '2012' },
    { value: '2011', label: '2011' },
    { value: '2010', label: '2010' },
    { value: '2009', label: '2009' },
    { value: '2008', label: '2008' },
    { value: '2007', label: '2007' },
    { value: '2006', label: '2006' },
    { value: '2005', label: '2005' },
    { value: '2004', label: '2004' },
];  


class Home extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
            make: null,
            model: null,
            year: null,
            engine: null,
            loading: null,
            specs: [],
            showSpecs: null,
            selectedYear: null,
            availableMakes: null,
            makesLoading: false,
            modelsLoading: false,
            enginesLoading: false,
            previousVehicles: []
        }
    };
    clearSelects = () => {
        this.setState({
            year: null,
            make: null,
            model: null,
            engine: null,
            showSpecs: null        
        })
    };
    clearVIN = () => {
        this.refs.vinNumber.value = '';
    };
    clearForm = () => {
        this.clearSelects();
        this.clearVIN();
    };
    replaceVehicle = (v) => {
        // Replaces the first item in previousVehicles array and adds new one to end
        let prevVehicles = this.state.previousVehicles;
        prevVehicles.shift();
        prevVehicles.push(v);
        this.setState({
            previousVehicles: prevVehicles
        });
    };
    setYear = (e) => {
        if (e === null) {
            this.setState({
                year: null,
                make: null,
                model: null,
                engine: null,
                makesLoading: false,
                availableEngines: null,
                availableMakes: null,
                availableModels: null,
                showSpecs: null 
            })
            this.refs.vinNumber.value = '';
            return false;
        } 
        this.setState({            
            year: e.value,
            make: null,
            model: null,
            engine: null,
            makesLoading: true,
            showSpecs: null
        })
        base.bindToState(`${e.value}`, {
            context: this,
            state: 'availableMakes',
            asArray: true,
            then(response) {
                this.setState({
                    makesLoading: false
                })
            }        
        })
    };
    setMake = (e) => {
        if (e === null) {
            this.setState({
                make: null,
                model: null,
                engine: null,
                availableEngines: null,
                availableModels: null,
                showSpecs: null 
            })
            this.refs.vinNumber.value = '';
            return false;
        }
        this.setState({
            make: e.value,
            modelsLoading: true            
        })
        base.bindToState(`${this.state.year}/${e.value}/`, {
            context: this,
            state: 'availableModels',
            asArray: true,
            then(response) {
                this.setState({
                    modelsLoading: false
                })
            }
        })
    };
    setModel = (e) => {
        if (e === null) {
            this.setState({
                model: null,
                engine: null,
                availableEngines: null,
                showSpecs: null 
            })
            this.refs.vinNumber.value = '';
            return false;
        }
        this.setState({
            model: e.value,
            enginesLoading: true
        })
        base.bindToState(`${this.state.year}/${this.state.make}/${e.value}`, {
            context: this,
            asArray: true,
            state: 'availableEngines',
            then(response) {
                this.setState({
                    enginesLoading: false
                })
            }
        });
    };
    setEngine = (e) => {
        if (e === null) {
            this.setState({
                engine: null,
                showSpecs: null 
            })
            this.refs.vinNumber.value = '';
            return false;
        }
        // const engineSizePeriod = e.value.replace(',', '.');
        const engineSizePeriod = formatEngine(e.value);
        this.setState({
            loading: true,
            engine: e.value,            
            engineFormatted: engineSizePeriod
        })
        const vehicle = `${this.state.year}/${this.state.make}/${this.state.model}/${e.value}`;
        this.replaceVehicle(vehicle);
        base.bindToState(`${this.state.year}/${this.state.make}/${this.state.model}/${e.value}`, {
            context: this,
            state: 'specs',
            asArray: false
        });
        this.refs.vinNumber.value = '';
        this.setState({
            displayYear: this.state.year,
            displayMake: this.state.make,
            displayModel: this.state.model,
            displayEngine: e.value,
            displayEngineFormatted: engineSizePeriod,
            error: null,
            loading: null,
            showSpecs: true
        }) 
    };
    submitVin = (e) => {
        e.preventDefault();
        this.setState({
            year: null,
            make: null,
            model: null,
            engine: null,
            makesLoading: false,
            availableEngines: null,
            availableMakes: null,
            availableModels: null,
            showSpecs: null,
            loading: true
        })
        const vinNumber = this.refs.vinNumber.value;
        if (vinNumber.length < 17) {
            this.setState({
                loading: null,
                error: 'VIN number must be 17 characters long.'                
            })
        } else {
            const vinDecodeUrl = `https://api.edmunds.com/v1/api/toolsrepository/vindecoder?vin=${vinNumber}&fmt=json&api_key=${process.env.REACT_APP_EDMUNDS_KEY}`;
            axios.get(vinDecodeUrl)
                .then(response => {
                    const data = response.data.styleHolder[0];
                    let engineSize;
                    if (data.engineSize.toString().length === 1) {
                        engineSize = `${data.engineSize}.0`;
                    } else {
                        engineSize = data.engineSize;
                    }
                    
                    this.setState({
                        displayYear: data.year,
                        displayMake: data.makeName,
                        displayModel: data.modelName,
                        displayEngine: engineSize,
                        displayEngineFormatted: engineSize,
                        error: null,
                        make: data.makeName,
                        model: data.modelName,
                        engine: engineSize,
                        year: data.year,
                        engineSizeComma: engineSize.toString().replace('.',','),
                        engineFormatted: engineSize
                    });              
                    const engineSizeComma = this.state.engine.toString().replace('.', ',');
                    const vehicle = `${this.state.year}/${this.state.make}/${this.state.model}/${engineSizeComma}`;
                    base.fetch(`${this.state.year}/${this.state.make}/${this.state.model}/${engineSizeComma}`, {
                        context: this,
                        asArray:false
                    }).then(data => {                        
                        if (data == null) {
                            console.log('no data');
                            this.setState({
                                loading: null,
                                error: 'This vehicle has not been added yet. We are working on it.',
                                errorType: 'Not In Database'
                            });
                            base.push(`notAdded/${this.state.year}-${this.state.make}-${this.state.model}-${this.state.engineSizeComma}`, {
                                data: true
                            });                                                        
                            return false;
                        }
                        base.bindToState(`${this.state.year}/${this.state.make}/${this.state.model}/${engineSizeComma}`, {
                            context: this,
                            state: 'specs',
                            asArray: false
                        });

                        // Replace vehicle in last 10 array
                        this.replaceVehicle(vehicle);

                        this.setState({
                            error: null,
                            loading: null,
                            showSpecs: true
                        })
                    }).catch(error => {
                        console.log(error);
                    })
                }).catch(err => {
                    console.log(err.response);
                    const errorText = err.response.data.message;
                    const errorType = err.response.data.errorType;
                    this.refs.vinNumber.value = '';
                    this.setState({
                        loading: null,
                        error: errorText,
                        errorType: errorType
                    })
                })
        }
    };
    searchVehicle = (vehicle) => {
        this.clearSelects();
        const vehicleSplit = vehicle.split('/');
        const year = vehicleSplit[0];
        const make = vehicleSplit[1];
        const model = vehicleSplit[2];
        const engine = vehicleSplit[3];
        const vehicleString = `${year}/${make}/${model}/${engine}`;
        console.log(vehicleSplit);

        base.bindToState(`${vehicleString}`, {
            context: this,
            state: 'specs',
            asArray: false
        });

        this.setState({
            displayYear: year,
            displayMake: make,
            displayModel: model,
            displayEngine: engine,
            displayEngineFormatted: formatEngine(engine),
            error: null,
            loading: null,
            showSpecs: true
        })
    };
    componentDidMount() {
        base.syncState(`previousVehicles`,{
            context: this,
            state: 'previousVehicles',
            asArray: true
        })
        base.bindToState(`messages`, {
            context: this,
            state: 'messages',
            asArray: true,
            queries: {
                limitToLast: 10,
                orderByChild: 'key'
            }
        })
    };
    render() {
        function logChange(val) {
            console.log("Selected: " + val);
        }
 
        let availableMakes = [];
        let availableModels = [];
        let availableEngines = [];
        if (this.state.availableMakes) {
            this.state.availableMakes.map((val, key) => {
                availableMakes.push( { "value": val.key, "label": val.key } );
            });
        }
        if (this.state.availableModels) {
            this.state.availableModels.map((val, key) => {
                availableModels.push( { "value": val.key, "label": val.key } );
            });
        }
        if (this.state.availableEngines) {
            this.state.availableEngines.map((val, key) => {
                availableEngines.push( { "value": val.key, "label": val.key.replace(',', '.') } );
            });
        }
        let loadingStatus;
        if (this.state.loading) {
            loadingStatus = <div className="mt-3 mb-3 col-xs"><img src={loadingSpinner} alt="" /></div>;
        } else {
            loadingStatus = null;
        }

        let previousTen = this.state.previousVehicles.map((vehicle, key) => {
            const vehicleSplit = vehicle.split('/');
            const year = vehicleSplit[0];
            const make = vehicleSplit[1];
            const model = vehicleSplit[2];
            const engine = vehicleSplit[3].replace(',', '.');
            const vehicleString = `${year} ${make} ${model} ${engine} L`;
            return <HistoryVehicle data={vehicleString} link={vehicle} key={key} handleClick={this.searchVehicle.bind(this)} />;
        });

        return (
            <div>
                <div className="row mt-3 hidden-print">
                    <div className="col-xs-12">
                        <h3 className="mb-1">Previous Vehicles</h3>                        
                    </div>                    
                </div>
                <div className="row">
                    {
                        previousTen
                    }
                </div>
                <div className="row mt-1">                    
                    <div className="col-xs-12 hidden-print">                                                                                      
                        <form className="col-sm-4 offset-sm-4" onSubmit={this.submitVin}>
                            <div className="form-group">
                                {this.state.error ? <div className="alert alert-danger">
                                                        <strong>{this.state.errorType}!</strong> {this.state.error}
                                                    </div>
                                                    
                                                    : null}
                            </div>
                            <div className="form-group">
                                <h3>Enter VIN Number</h3>
                                <input className="form-control" type="text" ref="vinNumber" />                                
                            </div>
                            <div className="form-group">                                
                                <button className="btn btn-primary" type="submit"><i className="fa fa-check"></i> Submit</button>                                
                            </div>                   
                        </form>                        
                    </div>
                </div>   
                <div className="row">
                    <div className="col-xs">
                        <button className="btn btn-link mb-2" onClick={this.clearForm}><i className="fa fa-trash"></i> Clear</button>
                    </div>
                </div>             
                <div className="row hidden-print">
                    <div className="col-sm-3 mb-1">
                        <Select
                            placeholder="Year"
                            name="form-field-year"
                            value={this.state.year}
                            options={options}
                            onChange={this.setYear}
                        />  
                    </div>
                    <div className="col-sm-3 mb-1">
                        <Select
                            placeholder="Make"
                            name="form-field-make"
                            value={this.state.make}
                            options={availableMakes}
                            onChange={this.setMake}
                            isLoading={this.state.makesLoading}
                        />  
                    </div>
                    <div className="col-sm-3 mb-1">
                        <Select
                            placeholder="Model"
                            name="form-field-model"
                            value={this.state.model}
                            options={availableModels}
                            onChange={this.setModel}
                            isLoading={this.state.modelsLoading}
                        />  
                    </div>
                    <div className="col-sm-3 mb-1">
                        <Select
                            placeholder="Engine"
                            name="form-field-engine"
                            value={this.state.engine}
                            options={availableEngines}
                            onChange={this.setEngine}
                            isLoading={this.state.enginesLoading}
                        />  
                    </div>
                </div>                
               
                <div className="row">                    
                    {                         
                        this.state.showSpecs ? <Specifications make={this.state.displayMake} model={this.state.displayModel} year={this.state.displayYear} engine={this.state.displayEngineFormatted} data={this.state.specs} /> 
                                             : loadingStatus
                    }
                </div>

                <div className="row flex-items-xs-center mt-1 hidden-print">
                    <div className="col-xs-8">
                        {
                            this.state.messages ? <Messages data={this.state.messages} /> : null
                        }
                    </div>
                </div>

            </div>                
        );
    }
}

export default Home;
