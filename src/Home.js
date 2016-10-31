import React, {Component} from 'react';
import Select from 'react-select';
import axios from 'axios';
import base from  './utils/base';
import loadingSpinner from './spinning-bubbles.svg';
import Specifications from './Specifications';

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
    { value: '2005', label: '2005' }
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
            enginesLoading: false
        }
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
        const engineSizeFormatted = e.value.replace(',', '.');
        this.setState({
            loading: true,
            engine: e.value,            
            engineSizeFormatted: engineSizeFormatted
        })
        base.bindToState(`${this.state.year}/${this.state.make}/${this.state.model}/${e.value}`, {
            context: this,
            state: 'specs',
            asArray: false
        });
        this.refs.vinNumber.value = '';
        this.setState({
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
                        error: null,
                        make: data.makeName,
                        model: data.modelName,
                        engine: engineSize,
                        year: data.year,
                        engineSizeFormatted: engineSize
                    });
                    const engineSizeFormatted = this.state.engine.toString().replace('.', ',')   
                    base.fetch(`${this.state.year}/${this.state.make}/${this.state.model}/${engineSizeFormatted}`, {
                        context: this,
                        asArray:false
                    }).then(data => {                        
                        if (data == null) {
                            console.log('no data');
                            this.setState({
                                loading: null,
                                error: 'This vehicle has not been added yet. We are working on it.'
                            });
                            base.push(`notAdded/${this.state.year}-${this.state.make}-${this.state.model}-${engineSizeFormatted}`, {
                                data: true
                            });                                                        
                            return false;
                        }
                        base.bindToState(`${this.state.year}/${this.state.make}/${this.state.model}/${engineSizeFormatted}`, {
                            context: this,
                            state: 'specs',
                            asArray: false
                        });
                        this.setState({
                            error: null,
                            loading: null,
                            showSpecs: true
                        })
                    }).catch(error => {
                        console.log(error);
                    })  
                }).catch(err => {
                    console.log(err);
                    this.refs.vinNumber.value = '';
                    this.setState({
                        loading: null,
                        error: 'Invalid VIN Number. Please try again.'
                    })
                })
        }
    };
    render() {
        function logChange(val) {
            console.log("Selected: " + val);
        }
        // let availableMakes = this.state.availableMakes ? this.state.availableMakes.map((val, key) => val.key ) : null;
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
            loadingStatus = <div className="mt-3"><img src={loadingSpinner} alt="" /></div>;
        } else {
            loadingStatus = null;
        }
        return (
            <div>
                <div className="row mt-3">                    
                    <div className="col-xs-12 hidden-print">                                                                                      
                        <form className="col-sm-4 offset-sm-4" onSubmit={this.submitVin}>
                            <div className="form-group">
                                {this.state.error ? <div className="alert alert-danger">
                                                        <strong>Error!</strong> {this.state.error}
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
                <div className="row hidden-print">
                    <div className="col-xs-3">
                        <Select
                            name="form-field-year"
                            value={this.state.year}
                            options={options}
                            onChange={this.setYear}
                        />  
                    </div>
                    <div className="col-xs-3">
                        <Select
                            name="form-field-make"
                            value={this.state.make}
                            options={availableMakes}
                            onChange={this.setMake}
                            isLoading={this.state.makesLoading}
                        />  
                    </div>
                    <div className="col-xs-3">
                        <Select
                            name="form-field-model"
                            value={this.state.model}
                            options={availableModels}
                            onChange={this.setModel}
                            isLoading={this.state.modelsLoading}
                        />  
                    </div>
                    <div className="col-xs-3">
                        <Select
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
                        this.state.showSpecs ? <Specifications make={this.state.make} model={this.state.model} year={this.state.year} engine={this.state.engineSizeFormatted} data={this.state.specs} /> 
                                             : loadingStatus
                    }
                </div>
            </div>                
        );
    }
}

export default Home;