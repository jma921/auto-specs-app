import React, {Component} from 'react';

class Navbar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-dark bg-primary">
                    <a className="navbar-brand" href="#">Specs App</a>
                    <ul className="nav navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Messages</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }
}

export default Navbar;