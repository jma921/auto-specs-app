import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './App';
import Home from './Home';
import NoMatch from './NoMatch';
import 'clipboard/lib/clipboard.js';
import './bootstrap.css';
import 'react-select/dist/react-select.css';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
