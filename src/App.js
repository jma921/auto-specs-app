import React, { Component } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navbar backgroundColor="#e74c3c" />
        <div className="container-fluid App-content">
          {this.props.children}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
