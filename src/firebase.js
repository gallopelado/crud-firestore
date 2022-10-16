import firebase from "firebase/app"
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAizKnVAiysk0RbTWcNWX-kV-JNjUJazPw",
    authDomain: "crud-udemy-react-2c3dd.firebaseapp.com",
    projectId: "crud-udemy-react-2c3dd",
    storageBucket: "crud-udemy-react-2c3dd.appspot.com",
    messagingSenderId: "662828730662",
    appId: "1:662828730662:web:e469aac98ddae6632159e7"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export { firebase }