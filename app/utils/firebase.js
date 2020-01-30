// src/firebase.js
import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyA22QKHaSJWmq19t0hnxV_6VwDbFPH7MXg",
  authDomain: "saranglimyida.firebaseapp.com",
  databaseURL: "https://saranglimyida.firebaseio.com",
  projectId: "saranglimyida",
  storageBucket: "saranglimyida.appspot.com",
  messagingSenderId: "388212374620",
  appId: "1:388212374620:web:06caea4bb290c2419d3a99"
};

firebase.initializeApp(config);
export default firebase;
