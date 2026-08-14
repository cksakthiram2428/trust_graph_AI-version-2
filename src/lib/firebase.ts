import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  OAuthProvider,
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  onSnapshot, 
  query, 
  orderBy,
  limit,
  serverTimestamp 
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App singleton
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Authentication singleton
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const microsoftProvider = new OAuthProvider("microsoft.com");

// Firestore singleton
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Helper Auth methods
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await syncUserToFirestore(result.user, "google");
    return result.user;
  } catch (error: any) {
    console.error("Google Sign-In error:", error);
    throw error;
  }
}

export async function signInWithGithub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await syncUserToFirestore(result.user, "github");
    return result.user;
  } catch (error: any) {
    console.error("GitHub Sign-In error:", error);
    throw error;
  }
}

export async function signInWithMicrosoft() {
  try {
    const result = await signInWithPopup(auth, microsoftProvider);
    await syncUserToFirestore(result.user, "microsoft");
    return result.user;
  } catch (error: any) {
    console.error("Microsoft Sign-In error:", error);
    throw error;
  }
}

export async function syncUserToFirestore(
  user: { uid?: string | null; email?: string | null; displayName?: string | null; name?: string | null; photoURL?: string | null } | FirebaseUser, 
  provider: "google" | "github" | "microsoft" | "password",
  customRole?: string
) {
  try {
    if (!user) return;
    const uid = user.uid || `user-${Date.now().toString(36)}`;
    const userRef = doc(db, "users", uid);
    const displayName = (user as any).displayName || (user as any).name || user.email?.split("@")[0] || "Executive Operator";
    const payload = {
      uid,
      email: user.email || "cpo@msme-trustgraph.com",
      displayName,
      photoURL: user.photoURL || "",
      provider,
      role: customRole || (provider === "google" ? "Verified Director (Google)" : provider === "github" ? "Risk Engineer (GitHub)" : provider === "microsoft" ? "Enterprise CPO (Microsoft 365)" : "Procurement Auditor"),
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "online"
    };
    await setDoc(userRef, payload, { merge: true });
  } catch (e) {
    console.warn("Could not sync user to Firestore users collection:", e);
  }
}

export function subscribeToRealtimeUsers(callback: (users: any[]) => void) {
  try {
    const usersCol = collection(db, "users");
    return onSnapshot(usersCol, (snapshot) => {
      const usersList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(usersList);
    }, (err) => {
      console.warn("Real-time users snapshot error:", err);
      // Fallback empty list
      callback([]);
    });
  } catch (e) {
    console.warn("Failed to subscribe to realtime users:", e);
    return () => {};
  }
}

export async function logOut() {
  try {
    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { status: "offline", lastLogoutAt: new Date().toISOString() });
      } catch (e) {}
    }
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Sign-Out error:", error);
    throw error;
  }
}

export { onAuthStateChanged };
export type { FirebaseUser };

