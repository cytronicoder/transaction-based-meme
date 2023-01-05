import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [transactionHash, setTransactionHash] = useState("");

    // This function monitors if the user has updated the input field
    const onInputChange = (e) => {
        console.log(e.target.value);
        setTransactionHash(e.target.value);
    };

    /**
     * This function does a few things:
     * 1. It checks to see if Metamask is installed
     * 2. If it is, it checks to see if the user has connected their wallet previously
     * 3. If they have, it grabs their public wallet address and sets it in our state
     * 4. If they haven't, it asks them to connect their wallet to our dApp
     */
    const checkIfWalletIsConnected = () => {
        // First make sure we have access to window.ethereum (Metamask)
        const { ethereum } = window;
        if (!ethereum) {
            console.log("🦊 Make sure you have Metamask installed!");
            return;
        } else {
            console.log("💸 Ethereum object exists!");
        }

        // Check if we're authorized to access the user's wallet
        ethereum.request({ method: "eth_accounts" }).then((accounts) => {
            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("👛", account);
                setCurrentAccount(account);
            } else {
                console.log(
                    "🤔 No authorized account found. You need to connect your Metamask wallet."
                );
            }
        });
    };

    /**
     * This function connects the user's wallet to our dApp
     */
    const connectWallet = () => {
        // Metamask access
        const { ethereum } = window;
        if (!ethereum) {
            alert("Make sure you have Metamask installed! 🦊");
        }

        // Request account access if needed
        ethereum
            .request({ method: "eth_requestAccounts" })
            .then((accounts) => {
                console.log("Connected", accounts[0]);
                setCurrentAccount(accounts[0]);
            })
            .catch((err) => console.log(err));
    };

    /**
     * This function searches for a transaction hash in Etherscan
     * TODO: Implement this function
     */
    const searchTransaction = () => {
        console.log("Searching for transaction hash:", transactionHash);
    };

    // Whenever the page loads, check to see if the user has connected their wallet
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <main>
            <div className="container">
                {/* Header + description */}
                <div className="header">Transaction-based Memes</div>
                <div className="description">
                    Input a transaction hash to see the meme associated with it.
                </div>

                {/*
                  If the user has not connected their wallet, display the connect wallet button.
                  Otherwise, display their wallet address.
                */}
                {currentAccount ? (
                    <div className="account">
                        {currentAccount.slice(0, 6)}...
                        {currentAccount.slice(-4)}
                        {/* {currentAccount} */}
                    </div>
                ) : (
                    <button className="button" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                {/* Input field for transaction hash once wallet is connected 
                TODO: Add CSS to make this look better
                */}
                {currentAccount && (
                    <div className="inputContainer">
                        <input
                            className="input"
                            type="text"
                            placeholder="Enter transaction hash"
                            onChange={onInputChange}
                        />
                        <button
                            className="submitButton"
                            onClick={searchTransaction}
                        >
                            Search
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
