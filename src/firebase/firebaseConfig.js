import firebase from 'firebase/app'

import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDAKNukXjDNKnH4fJ77MG5uBgsJHIcAWmw",
    authDomain: "react-signin-35967.firebaseapp.com",
    projectId: "react-signin-35967",
    storageBucket: "react-signin-35967.appspot.com",
    messagingSenderId: "223865835213",
    appId: "1:223865835213:web:690fc11f3577c68e712384"
  };
  


firebase.initializeApp(firebaseConfig);

const db = firebase.firestore()
const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export {
    db,
    googleAuthProvider,
    firebase
}