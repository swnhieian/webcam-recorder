import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App.js';
import io from 'socket.io-client'; 

const socket = io('http://183.173.149.152:5000');

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));