import React, { useState } from "react";
import "./Transactions.css";

export default function Transactions({ addr }) {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [etherscanData, setEtherscanData] = useState(null);

    // This function monitors if the user has updated the input field
    const onInputChange = (e) => {
        console.log(e.target.value);
        setSelectedAddress(e.target.value);
    };

    /**
     * This is a secret key that allows us to access Etherscan's API.
     * From https://vitejs.dev/guide/env-and-mode.html
     */
    const etherscan_api_key = import.meta.env.VITE_ETHERSCAN_API_KEY;

    /**
     * This function searches for a transaction hash in Etherscan
     * and sets the meme based on the result
     */
    const searchTransaction = () => {
        console.log("Searching for transaction hash: ", addr);

        // Returns the list of transactions performed by an address
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${selectedAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${etherscan_api_key}`;
        const data = fetch(url).then((res) => res.json());
        data.then((data) => {
            setEtherscanData(data);
        });
    };

    return (
        <>
            {/* Input field for transaction hash once wallet is connected */}
            <div className="inputContainer">
                <input
                    className="input"
                    type="text"
                    placeholder="Enter transaction hash"
                    onChange={onInputChange}
                />
                <button className="submitButton" onClick={searchTransaction}>
                    Search
                </button>
            </div>
            
            etherscanData && (
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
                        {/* get the first 5 */}
                        {etherscanData.result.slice(0, 5).map((tx) => (
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
                                        tx.value / 1000000000000000000
                                    ).toFixed(4)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )
        </>
    );
}