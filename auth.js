// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFSClNGcjzZDYrzP4fmESNyW0_Y6lvJTU",
  authDomain: "text-summarizer-ad686.firebaseapp.com",
  projectId: "text-summarizer-ad686",
  storageBucket: "text-summarizer-ad686.appspot.com",
  messagingSenderId: "106650933946",
  appId: "1:106650933946:web:fad8af5c83c59697798083",
  measurementId: "G-GBGP6S7MH6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Initialize Firestore
const db = firebase.firestore();

// Wait until the page is fully loaded before accessing elements
document.addEventListener("DOMContentLoaded", () => {
  /** LOGIN FUNCTION **/
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          console.log("User logged in:", userCredential.user);
          loginForm.reset();
          alert("Login successful!");
          // Redirect if needed: window.location.href = "/dashboard.html";
        })
        .catch((error) => {
          console.error("Login error:", error.message);
          alert("Login failed: " + error.message);
        });
    });
  }

  /** REGISTER FUNCTION **/
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User registered:", user);
          // Update the user profile with the display name
          return user.updateProfile({ displayName: username })
            .then(() => user);
        })
        .then((user) => {
          // Store additional user info in Firestore under "users" collection
          return db.collection("users").doc(user.uid).set({
            username: username,
            email: email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        })
        .then(() => {
          registerForm.reset();
          alert("Registration successful!");
          // Optionally, redirect to a welcome page:
          // window.location.href = "/welcome.html";
        })
        .catch((error) => {
          console.error("Registration error:", error.message);
          alert("Registration failed: " + error.message);
        });
    });
  }
});
