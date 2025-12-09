import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { db } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  arrayUnion, 
  arrayRemove, 
  getDoc 
} from "firebase/firestore";
import "./App.css";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]); 
  const [activeTab, setActiveTab] = useState("home"); 

  // --- 1. CONNECT WALLET ---
  async function connectWallet() {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setWalletAddress(address);
        createUserInDB(address);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  }

  // --- 2. DATABASE SETUP ---
  async function createUserInDB(address) {
    const userRef = doc(db, "users", address);
    await setDoc(userRef, { wallet: address }, { merge: true });
    fetchData(address);
  }

  // --- 3. FETCH DATA ---
  async function fetchData(address) {
    if(!address) return;
    
    // Get All Users
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map(doc => doc.data()));

    // Get My Data (Friends & Requests)
    const myDoc = await getDoc(doc(db, "users", address));
    if (myDoc.exists()) {
      setFriends(myDoc.data().friends || []);
      setRequests(myDoc.data().incomingRequests || []);
    }
  }

  // --- 4. SEND REQUEST (The Fix!) ---
  // This NO LONGER adds them as a friend. It only sends a "Letter".
  async function sendRequest(targetAddress) {
    if (targetAddress === walletAddress) return alert("You can't add yourself!");
    
    const targetRef = doc(db, "users", targetAddress);
    
    // Update THEIR database entry with a request
    await updateDoc(targetRef, {
      incomingRequests: arrayUnion(walletAddress)
    });
    alert("Friend Request Sent! (Waiting for them to accept)");
  }

  // --- 5. ACCEPT REQUEST ---
  async function acceptRequest(requesterAddress) {
    const myRef = doc(db, "users", walletAddress);
    const theirRef = doc(db, "users", requesterAddress);

    // Add to MY friends & Remove the request
    await updateDoc(myRef, {
      friends: arrayUnion(requesterAddress),
      incomingRequests: arrayRemove(requesterAddress)
    });

    // Add ME to THEIR friends
    await updateDoc(theirRef, {
      friends: arrayUnion(walletAddress)
    });

    alert("Friend Request Accepted!");
    fetchData(walletAddress); 
  }

  // --- UI RENDER ---
  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "800px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h1>Web3 Social Graph</h1>
        {!walletAddress ? (
          <button onClick={connectWallet} style={{padding: "10px", background: "black", color: "white"}}>Connect Wallet</button>
        ) : (
          <div>Connected: {walletAddress.slice(0,6)}...</div>
        )}
      </header>

      {walletAddress && (
        <>
          {/* TABS */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button onClick={() => setActiveTab("home")}>🏠 Home</button>
            <button onClick={() => setActiveTab("requests")}>📬 Requests ({requests.length})</button>
            <button onClick={() => setActiveTab("profile")}>👤 Profile</button>
          </div>

          {/* HOME TAB */}
          {activeTab === "home" && (
            <div>
              <h3>All Users</h3>
              {users.map(user => (
                <div key={user.wallet} style={{border: "1px solid #ccc", padding: "10px", margin: "5px 0"}}>
                  <span>{user.wallet}</span>
                  {user.wallet !== walletAddress && (
                    <button 
                      onClick={() => sendRequest(user.wallet)} 
                      style={{marginLeft: "10px", background: "blue", color: "white"}}>
                      Send Request
                    </button>
                  )}
                  {user.wallet === walletAddress && <b> (You)</b>}
                </div>
              ))}
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === "requests" && (
            <div>
              <h3>Incoming Requests</h3>
              {requests.length === 0 ? <p>No pending requests.</p> : requests.map(req => (
                <div key={req} style={{border: "1px solid #ccc", padding: "10px"}}>
                  <p>Request from: {req}</p>
                  <button onClick={() => acceptRequest(req)} style={{background: "green", color: "white"}}>
                    Accept
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div>
              <h3>My Friends</h3>
              {friends.length === 0 ? <p>No friends yet.</p> : friends.map(friend => (
                <div key={friend} style={{border: "1px solid #ccc", padding: "10px"}}>
                  👤 {friend}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;