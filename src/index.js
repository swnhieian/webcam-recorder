import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import admin from 'firebase-admin';
import functions from 'firebase-functions';

// -------------------------- Firebase ------------------------- //

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

// --------------------------- React --------------------------- //

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
