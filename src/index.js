import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase/app'
import firestore from 'firebase/firestore'


const firebaseConfig = {
  apiKey: 'AIzaSyD6YlDRSzOgeB5ppmaQq3eMwW-C3D-aZVY',
  authDomain: 'webcam-recorder-db.firebaseapp.com',
  databaseURL: 'https://webcam-recorder-db.firebaseio.com',
  projectId: 'webcam-recorder-db',
  storageBucket: 'webcam-recorder-db.appspot.com',
  messagingSenderId: '261814907199',
  appId: '1:261814907199:web:19b731560c831f55'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// --------------------------- React --------------------------- //

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
