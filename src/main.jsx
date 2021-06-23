import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

document.addEventListener('wheel', event => {
  if (event.ctrlKey) event.preventDefault();
}, { passive: false });

document.addEventListener('keydown', event => {
  if (event.ctrlKey && ((event.key === '+') || (event.key === '-'))) {
    event.preventDefault();
  }
});
