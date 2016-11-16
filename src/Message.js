import React, {Component} from 'react';
import moment from 'moment'

class Message extends Component {
    render() {
        const date = moment(this.props.data.timestamp).format("MMM D YY h:mm A");
        return (
                <dl className="row">                    
                    <dd className="col-sm-3 mb-0"><em><i className="fa fa-clock-o"></i> {date}</em></dd>
                    <dd className="col-sm-2 mb-0"><i className="fa fa-user-o"></i> {this.props.data.name}</dd>
                    <dd className="col-sm-7 mb-0 text-sm-left"><i className="fa fa-comment-o"></i> {this.props.data.error}</dd>
                    <div className="hidden-md-up divider"></div>
                </dl>
        );
    }
}

export default Message;