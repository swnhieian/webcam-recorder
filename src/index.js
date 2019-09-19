import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App.js';
import io from 'socket.io-client'; 

const socket = io('http://192.168.0.101:5000');

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));