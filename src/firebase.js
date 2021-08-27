import firebase from 'firebase';
const firebaseConfig = firebase.initializeApp({
    apiKey: "AIzaSyAXFE6ChKhjhfk5GXy5KvPX3r6ngvNuh4Q",
    authDomain: "instagram-a4425.firebaseapp.com",
    databaseURL: "https://instagram-a4425.firebaseio.com",
    projectId: "instagram-a4425",
    storageBucket: "instagram-a4425.appspot.com",
    messagingSenderId: "187460298750",
    appId: "1:187460298750:web:908cc4202fbe5f602142af",
    measurementId: "G-TZLDSDJWM5"
  });
  
  const db = firebaseConfig.firestore();
  const storage = firebase.storage();
  const auth = firebase.auth();
  
  export{db,storage,auth};