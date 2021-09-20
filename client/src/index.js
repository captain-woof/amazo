import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom'
import './index.css';
import AllContextsWrappingApp from './components/common/allContextsWrappingApp';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AllContextsWrappingApp />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);