 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"; // Import the functions that may be needed from the SDKs needed
    // Import the Firebase Authentication and Firestore modules
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"; // Import the Firebase Authentication module
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"; // Import the Firestore module
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries

 // Your web app's Firebase configuration - this is the configuration for the Bridgepoint Members Firebase project recieved from the Firebase console
 // For Firebase JS SDK v7.20.0 and later, measurementId is optional 
 // The following configuration is for the Bridgepoint Members Firebase project
 const firebaseConfig = {
   apiKey: "AIzaSyBDyZwaPOV-A8FUKBA_rz8Ub0pd5la-m94",
   authDomain: "bridgepoint-members.firebaseapp.com",
   projectId: "bridgepoint-members",
   storageBucket: "bridgepoint-members.firebasestorage.app",
   messagingSenderId: "87779290497",
   appId: "1:87779290497:web:86c3b6da632fa2439fcc80",
   measurementId: "G-1QYRMHWHV6"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 // Function to show a message in a specified div - this function will be used to display success or error messages to the user
 // The message will be displayed for 5 seconds before fading out
 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 // Event listener for the sign-up button
 // When clicked, it prevents the default form submission, retrieves the input values,
// and attempts to create a new user with the provided email and password
//  // If successful, it stores the user's data in Firestore and redirects to the homepage
// If there's an error (e.g., email already in use), it displays an appropriate message
// Event listener for the sign-in button 
// When clicked, it prevents the default form submission, retrieves the input values
 // and attempts to sign in the user with the provided email and password
// If successful, it stores the user's ID in local storage and redirects to the homepage
// If there's an error (e.g., invalid credentials), it displays an appropriate message
// The sign-up and sign-in buttons are identified by their respective IDs in the HTML
 const signUp=document.getElementById('submitSignUp');
 signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value;
    const password=document.getElementById('rPassword').value;
    const firstName=document.getElementById('fName').value;
    const lastName=document.getElementById('lName').value;

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Account Created Successfully', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('Email Address Already Exists !!!', 'signUpMessage');
        }
        else{
            showMessage('unable to create User', 'signUpMessage');
        }
    })
 });

 // Event listener for the sign-in button
    // When clicked, it prevents the default form submission, retrieves the input values
    // and attempts to sign in the user with the provided email and password
 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('login is successful', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='homepage.html';
    })
    // If there's an error (e.g., invalid credentials), it displays an appropriate message
    // If the sign-in is successful, it stores the user's ID in local storage and redirects to the homepage
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Incorrect Email or Password', 'signInMessage');
        }
        else{
            showMessage('Account does not Exist', 'signInMessage');
        }
    })
 })