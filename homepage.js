import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js"; // Import the Firebase app module
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js"; // Import the Firebase authentication module
import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js" // Import the Firestore module

/* * This script initializes Firebase, sets up authentication state management,
 * retrieves user data from Firestore, and handles user logout functionality.
 * It also manages the visibility of a sidebar navigation menu based on screen size.
 * The script uses Firebase Authentication and Firestore to manage user sessions and data.
 */
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

/* * this function listens for changes in the authentication state of the user.
    * when the user is logged in, it retrieves their user ID from local storage,   
    * fetches their data from Firestore, and updates the HTML elements with their information.
    * of the user is not logged in, it logs a message indicating that the user ID was not found.
    * it also handles the logout functionality by removing the user ID from local storage
    * and signing the user out of Firebase when the logout button is clicked.
    */
const auth = getAuth();
const db = getFirestore();

/* * Listen for authentication state changes
    * when the user logs in or out, this function will be triggered
    * if the user is logged in, it retrieves their user ID from local storage
    * and fetches their data from Firestore to update the HTML elements
    * if the user is not logged in, it logs a message indicating that the user ID was not found and the screen will display empty user information
    * also handles the logout functionality by removing the user ID from local storage and signing the user out of Firebase when the logout button is clicked
    * This ensures that the user interface reflects the current authentication state and provides a smooth experience for the user.
    */
onAuthStateChanged(auth, (user) => { 
    const loggedInUserId = localStorage.getItem('loggedInUserId'); 
    if(loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap) => {
            if(docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('loggedUserFName').innerText = userData.firstName;
                document.getElementById('loggedUserEmail').innerText = userData.email;
                document.getElementById('loggedUserLName').innerText = userData.lastName;
            }
            else {
                console.log("no document found matching id")
            }
        })
        .catch((error) => {
            console.log("Error getting document");
        })
    }
    else {
        console.log("User Id not Found in Local storage")
    }
})

// Logout Functionality
// This function handles the logout process when the user clicks the logout button
// It removes the user ID from local storage, signs the user out of Firebase, and redirects the user to the index.html page
const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(() => {
        window.location.href = 'index.html';
    })
    .catch((error) => {
        console.error('Error Signing out:', error);
    })
})

// Initialize navbar state
