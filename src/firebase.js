import app from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyBSNSqzMIf8lg56ha9Qg5OSd1WwR4N15ao",
    authDomain: "crud-react-firestore-6f4bd.firebaseapp.com",
    projectId: "crud-react-firestore-6f4bd",
    storageBucket: "crud-react-firestore-6f4bd.appspot.com",
    messagingSenderId: "899861972356",
    appId: "1:899861972356:web:bcb89335663975d9e909d1"
  };
  
  // Initialize Firebase
app.initializeApp(firebaseConfig);

const db = app.firestore()
const auth = app.auth()

export { db, auth }