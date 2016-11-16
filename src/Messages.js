import React, {Component} from 'react';
import Message from './Message';

class Messages extends Component {
    
    render() {
        return (
            <div>
                <div className="card card-outline-primary text-xs-center">
                    <div className="card-block">
                        <h3><i className="fa fa-comments"></i> Messages</h3>
                        <div className="row"><div className="divider"></div></div>
                        {
                            this.props.data.map((val, key) => { return <Message data={val} key={key} />})
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Messages;