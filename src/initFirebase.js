import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCPhI41Q8aTu5M6rXk8RQsHlv3sPiUNZTc",
    authDomain: "yrkesdorren-bfdfc.firebaseapp.com",
    databaseURL: "https://yrkesdorren-bfdfc-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "yrkesdorren-bfdfc",
    storageBucket: "yrkesdorren-bfdfc.appspot.com",
    messagingSenderId: "785331896281",
    appId: "1:785331896281:web:bf5b801ead4acc875923c8"
  };

  function initFirebase() {
      if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
      }
  }

  initFirebase();

  export { firebase };