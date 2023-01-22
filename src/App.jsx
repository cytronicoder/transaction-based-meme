import React, { useEffect, useState } from "react";
import "./App.css";

import shippor from "./assets/shippor.jpeg";
import binary from "./assets/binary.png";
import optimisation from "./assets/optimisation.jpeg";

export default function App() {
    const [loggedAddress, setLoggedAddress] = useState("");
    const [selectedAddress, setSelectedAddress] = useState("");

    const [meme, setMeme] = useState(null);
    const [memeAlt, setMemeAlt] = useState("");

    // This function monitors if the user has updated the input field
    const onInputChange = (e) => {
        console.log(e.target.value);
        setSelectedAddress(e.target.value);
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
                setLoggedAddress(account);
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
                setLoggedAddress(accounts[0]);
            })
            .catch((err) => console.log(err));
    };

    /**
     * This is a secret key that allows us to access Etherscan's API.
     * From https://vitejs.dev/guide/env-and-mode.html
     */
    const etherscan_api_key = import.meta.env.VITE_ETHERSCAN_API_KEY;

    /**
     * This function searches for a transaction hash in Etherscan
     */
    const searchTransaction = () => {
        console.log("Searching for transaction hash: ", selectedAddress);

        // Returns the list of transactions performed by an address
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${selectedAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${etherscan_api_key}`;
        const data = fetch(url).then((res) => res.json());
        return data;
    };

    /** This function determines whether:
     * 1. The author of the transaction is the logged in address, or
     * 2. The logged in address sent/received a transaction, or
     * 3. The logged in address is not involved in the transaction at all
     *
     * It gets information about the transaction from Etherscan
     */
    const getTransactionInfo = async () => {
        // Search for the transaction hash in Etherscan asynchonously
        const etherscanData = await searchTransaction();

        // If selectedAddress is loggedAddress, then the author of the transaction is loggedAddress
        if (selectedAddress === loggedAddress) {
            setMemeAlt("The author is this address!");
            setMeme(optimisation);
        } else {
            // If the loggedAddress is not the author of the transaction, then check if they sent/received a transaction
            // Get the list of transactions performed by the loggedAddress
            const senders = etherscanData.result.map((transaction) => {
                return transaction.from;
            });

            // Get the list of transactions received by the loggedAddress
            const receivers = etherscanData.result.map((transaction) => {
                return transaction.to;
            });

            // Conditionals
            if (senders.includes(loggedAddress)) {
                setMemeAlt("This address has once sent a transaction!");
                setMeme(shippor);
            } else if (receivers.includes(loggedAddress)) {
                setMemeAlt("This address has once received a transaction!");
                setMeme(shippor);
            } else {
                setMemeAlt("This address is not involved in any of the transactions!");
                setMeme(binary);
            }
        }
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
                {loggedAddress ? (
                    <>
                        <div className="account">
                            {loggedAddress.slice(0, 6)}...
                            {loggedAddress.slice(-4)}
                            {/* {loggedAddress} */}
                        </div>
                        {/* Input field for transaction hash once wallet is connected */}
                        <div className="inputContainer">
                            <input
                                className="input"
                                type="text"
                                placeholder="Enter transaction hash"
                                onChange={onInputChange}
                            />
                            <button
                                className="button"
                                onClick={getTransactionInfo}
                            >
                                Get Transaction Info
                            </button>
                            {/* <button
                                className="button"
                                onClick={searchTransaction}
                            >
                                Search
                            </button> */}
                        </div>

                        {/* Display the meme if hash found */}
                        {meme && (
                            <div className="memeContainer">
                                <img className="meme" src={meme} />
                                <div className="memeAlt">{memeAlt}</div>
                            </div>
                        )}
                    </>
                ) : (
                    <button className="button" onClick={connectWallet}>
                        Connect Wallet
                    </button>
                )}

                {/* Display transaction history - not used anymore */}
                {/* {etherscanData && (
                    <div className="tableContainer">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Block Number</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Value (ETH)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {etherscanData.result
                                    .slice(-5)
                                    .reverse()
                                    .map((tx) => (
                                        <tr key={tx.hash}>
                                            <td>{tx.blockNumber}</td>
                                            <td>
                                                {tx.from.slice(0, 6)}...
                                                {tx.from.slice(-4)}
                                            </td>
                                            <td>
                                                {tx.to.slice(0, 6)}...
                                                {tx.to.slice(-4)}
                                            </td>
                                            <td>
                                                {parseFloat(
                                                    tx.value /
                                                        1000000000000000000
                                                ).toFixed(4)}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )} */}
            </div>
        </main>
    );
}
