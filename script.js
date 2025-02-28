// Import the functions you need from the SDKs you need
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js';

import { getAnalytics } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js';

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js';

import { getFirestore, collection, addDoc, doc, getDoc } from 'https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js';

import { COLORS, TEXTURES, MATERIALS, ARTWORK } from './data.js';

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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

async function uploadDataToFirestore() {
    try {
        // Upload COLORS
        for (const [colorName, colorData] of Object.entries(COLORS)) {
            await addDoc(collection(db, "colors"), {
                name: colorName,
                ...colorData
            });
            console.log(`Added color: ${colorName}`);
        }

        // Upload TEXTURES
        for (const [textureName, textureData] of Object.entries(TEXTURES)) {
            await addDoc(collection(db, "textures"), {
                name: textureName,
                ...textureData
            });
            console.log(`Added texture: ${textureName}`);
        }

        // Upload MATERIALS
        for (const [materialName, materialData] of Object.entries(MATERIALS)) {
            await addDoc(collection(db, "materials"), {
                name: materialName,
                ...materialData
            });
            console.log(`Added material: ${materialName}`);
        }

        // Upload ARTWORK
        for (const [artworkName, artworkData] of Object.entries(ARTWORK)) {
            await addDoc(collection(db, "artwork"), {
                name: artworkName,
                ...artworkData
            });
            console.log(`Added artwork: ${artworkName}`);
        }

        console.log("All data uploaded successfully!");
    } catch (error) {
        console.error("Error uploading data:", error);
    }
}

// Call the function to upload data
// Uncomment this line when you're ready to upload the data
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

// Example usage
createUser("your.email@example.com", "yourpassword", "Your Name");

// Example usage
loginUser("your.email@example.com", "yourpassword");

// Example usage
const user = auth.currentUser; // Get the current logged-in user
if (user) {
    submitForm("Your text description", ["tag1", "tag2"], user);
}


