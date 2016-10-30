import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App pt-3">
        <div className="container-fluid">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
