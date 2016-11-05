import React, {Component} from 'react';

class Messages extends Component {
    render() {
        return (
            <div className="card card-outline-primary text-xs-center">
                <div className="card-block">
                    <h3>Messages</h3>
                    <p>{this.props.data}</p>
                </div>
            </div>
        );
    }
}

export default Messages;