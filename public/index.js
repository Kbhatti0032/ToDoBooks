import Framework7 from 'framework7/framework7.esm.bundle';
import Dom7 from 'dom7';
import firebase from 'firebase/app';
import 'firebase/auth';
import config from "./firebase.js";
import app from "./F7App.js";
import "./books.js";

firebase.initializeApp(config);
const $$ = Dom7;


firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        app.tab.show("#tab2", true);
        console.log(user);
    } else {
        app.tab.show("#tab1", true);
        console.log("logged out");
    }
});

$$("#loginForm").on("submit", (evt) => {
    evt.preventDefault();
    var formData = app.form.convertToData('#loginForm');
    firebase.auth().signInWithEmailAndPassword(formData.username, formData.password).then(
        () => {
            // could save extra info in a profile here I think.
            app.loginScreen.close(".loginYes", true);
        }
    ).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $$("#signInError").html(errorCode + " error " + errorMessage)
        console.log(errorCode + " error " + errorMessage);
        // ...
    });

});

$$(".googlesignupbutton").on("click", () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);    
});

// $$("#googlebutton").on("click", () => {
//     var provider = new firebase.auth.GoogleAuthProvider();
//     firebase.auth().signInWithPopup(provider).then(function(result) {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         var token = result.credential.accessToken;
//         // The signed-in user info.
//         var user = result.user;
//         console.log(user+"  "+token);
//         // ...
//       }).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // The email of the user's account used.
//         var email = error.email;
//         // The firebase.auth.AuthCredential type that was used.
//         var credential = error.credential;  
//         console.log(errorMessage);       // ...
//       });
       
// });

$$("#signUpForm").on("submit", (evt) => {
    evt.preventDefault();
    var formData = app.form.convertToData('#signUpForm');
    //alert("clicked Sign Up: " + JSON.stringify(formData));
    firebase.auth().createUserWithEmailAndPassword(formData.username, formData.password).then(
        () => {
            // could save extra info in a profile here I think.
            app.loginScreen.close(".signupYes", true);
        }
    ).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $$("#signUpError").html(errorCode + " error " + errorMessage)
        console.log(errorCode + " error " + errorMessage);
        // ...
    });

});

$$("#logout").on("click", () => {
    firebase.auth().signOut().then(() => {
        // Sign-out successful.
    }).catch(() => {
        // An error happened.
    });
});
