import React, { Component } from 'react';
import Navbar from './Navbar';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar />
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
