// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase Configuration
const firebaseConfig = {
apiKey: "AIzaSyDWKcR-dzcwq0PoBwmPVp-Kr-xmYlCah3Q",
authDomain: "tactileart-cse482a.firebaseapp.com",
projectId: "tactileart-cse482a",
storageBucket: "tactileart-cse482a.firebasestorage.app",
messagingSenderId: "954927873836",
appId: "1:954927873836:web:c35026dd563a900399f689",
measurementId: "G-V7SS7LHDZ3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();
const db = firebase.firestore();
const app = initializeApp(firebaseConfig);

async function uploadDataToFirestore() {
    const collections = ["colors", "textures", "materials", "artwork"];

    for (const collectionName of collections) {
        const collectionRef = collection(db, collectionName);
        const data = firestoreData[collectionName];

        for (const item of data) {
        await addDoc(collectionRef, item);
        console.log(`Added document to ${collectionName}: ${item.id}`);
        }
    }
}

uploadDataToFirestore();

//Function for creating a new user
async function createUser(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created:", user);

      //Store user data in Firestore after creation
      await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: name,
          email: email,
      });

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error creating user:", errorCode, errorMessage);
    }
}


// Function for user login
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("Logged in user:", user);
    //Here you would redirect to the user's main dashboard.
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error logging in:", errorCode, errorMessage);
  }
}



// Function to submit the form
async function submitForm(text, tags, user) {
  try {
    const submission = {
      userId: user.uid,
      text: text,
      tags: tags,
      timestamp: new Date(),
    };
    await addDoc(collection(db, "submissions"), submission);
    console.log("Form submitted successfully!");
  } catch (error) {
    console.error("Error submitting form:", error);
  }
}

//Example usage
// createUser("user@example.com", "password123", "Example User");
// loginUser("user@example.com", "password123");


// Authentication State Listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    //Get user information
    const userDocRef = doc(db, "users", user.uid);
    getDoc(userDocRef).then(docSnap => {
      if (docSnap.exists()) {
        console.log("User Data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    });

  } else {
    console.log("User is signed out");
  }
});


