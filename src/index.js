import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App.js';
import io from 'socket.io-client'; 

const socket = io('http://192.168.0.102:5000');
// const socket = io('www.webcamrecorderserver.net');

ReactDOM.render(<App socket={socket} />, document.getElementById('root'));