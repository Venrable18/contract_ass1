import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss";
import React from "react";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);

  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        toast.warn("Please enter a message before setting.");
        return;
      }
      setLoading(true);
      if (window.ethereum) {
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.setMessage(text); 
        await tx.wait();
        toast.success("Message set successfully!");
        setText("");
        // Optionally refresh the message
        handleGet();
      } else {
        toast.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      toast.error(error.message || "Error setting message");
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    try {
      setLoading(true);
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const data = await contract.getMessage();
        setMessage(data);
        toast.info("Message fetched!");
      } else {
        toast.error("MetaMask not found. Please install MetaMask to use this application.");
      }
    } catch (error) {
      toast.error(error.message || "Error getting message");
    } finally {
      setLoading(false);
    }
  };

  // Fetch message on mount
  React.useEffect(() => {
    handleGet();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <ToastContainer position="top-center" />
      <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-blue-700 mb-6 tracking-tight">
          Smart Contract Messenger
        </h1>
        <div className="mb-6 flex gap-5">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="messageInput">
            Enter a new message
          </label>
          <input
            id="messageInput"
            type="text"
            placeholder="Type your message here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            disabled={loading}
          />
        </div>
        <div className="flex gap-3 mb-8">
          <button
            onClick={handleSet}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Set Message"}
          </button>
          <button
            onClick={handleGet}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow-md ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Loading..." : "Get Message"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
