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

export async function updateUserProfileInFirestore(uid: string, updates: Record<string, any>) {
  try {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn("Could not update user profile in Firestore:", e);
    return false;
  }
}

export async function updateUserPresence(uid: string, presenceData: {
  status?: "online" | "active" | "away" | "offline";
  currentView?: "3D_SPACE" | "2D_TOPOLOGY" | "RISK_MATRIX";
  supplierFocus?: string | null;
  cursorPosition?: { x: number; y: number };
  mouseActivity?: boolean;
  sessionDuration?: number;
}) {
  try {
    if (!uid) return;
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, {
      ...presenceData,
      lastActivity: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (e) {
    console.warn("Could not update user presence in Firestore:", e);
    return false;
  }
}

export async function logAdminOperation(
  action: string,
  category: "MSME_INGESTION" | "SUPPLIER_EDIT" | "RISK_RECTIFICATION" | "AI_FORENSICS" | "USER_AUTH" | "SYSTEM_AUDIT",
  details: string,
  user?: { uid?: string; email?: string } | null,
  metadata?: Record<string, any>
) {
  try {
    const logsCol = collection(db, "admin-logs");
    await addDoc(logsCol, {
      action,
      category,
      details,
      userId: user?.uid || "system-auto",
      userEmail: user?.email || "cpo@msme-trustgraph.com",
      metadata: metadata || {},
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.warn("Could not write admin log to Firestore:", e);
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

export function subscribeToAdminLogs(callback: (logs: any[]) => void, maxItems: number = 20) {
  try {
    const logsCol = collection(db, "admin-logs");
    const q = query(logsCol, orderBy("timestamp", "desc"), limit(maxItems));
    return onSnapshot(q, (snapshot) => {
      const logsList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(logsList);
    }, (err) => {
      console.warn("Real-time admin-logs snapshot error:", err);
      callback([]);
    });
  } catch (e) {
    console.warn("Failed to subscribe to admin-logs:", e);
    return () => {};
  }
}

export async function checkFirebaseConnectivity(): Promise<boolean> {
  try {
    const testDoc = doc(db, "users", "__health_probe__");
    await getDoc(testDoc);
    return true;
  } catch (e) {
    return false;
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

