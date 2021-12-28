import { useEffect, useState } from "react";
import { isWalletConnected, disconnectWallet, connectWalletUsingWeb3, getCurrentWalletConnected, buyToken, getTotalRaisedAmount } from "./utils/interact";

const Saler = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [bnbAmount, setBNBAmount] = useState(0.0);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [raisedBNB, setRaisedBNB] = useState(0);
  const [url, setURL] = useState("");
  
  const [BNBStatus, setBNBStatus] = useState("");
  
  useEffect(async () => { //TODO: implement
    const { address, status } = await getCurrentWalletConnected();
    setWallet(address);
    setStatus(status);

    addWalletListener();
  }, []);

  useEffect(() => {
    setBNBAmount(tokenAmount / 5000);
    if ((tokenAmount / 5000) < 0.1) setBNBStatus("BNB Amount should be over 0.1");
    else setBNBStatus("");
  }, [tokenAmount])

  useEffect(async () => {
    let raisedAmount = await getTotalRaisedAmount();
    setRaisedBNB(raisedAmount);
    console.log("raisedAmount =", raisedAmount);
  }, [status])

  const connectWalletPressed = async () => { //TODO: implement
    if (!isWalletConnected()) {
      const { address, status } = await connectWalletUsingWeb3();
      setWallet(address);
      setStatus(status);
    } else {
      await disconnectWallet();
      setWallet("");
    }
  };

  const onBuyPressed = async () => { //TODO: implement
    if (!isWalletConnected()) {
      const status = "Connect your Wallet.";
      setStatus(status);
      return;
    }
    const { status } = await buyToken(bnbAmount);
    setStatus(status);
  };

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Put BNB Amount in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      })
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );  
    }
  }

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
      <h1>Total Raised: {raisedBNB} BNB</h1>
      <h1>Total Token Sold: {raisedBNB*5000} NVD</h1>
      <br></br>
      
      <h2>Token Price: {1/5000}  BNB</h2>
      <form>
        <h1>NVD amount</h1>
        <input
          type="text"
          placeholder="0"
          value={tokenAmount}
          onChange={(event) => setTokenAmount(event.target.value)}
        />
      </form>
      <h1>
        BNB Amount :
        { bnbAmount } BNB
      </h1>
      <p style={{color: 'red'}}>
        {BNBStatus}
      </p>

      <button id="mintButton" onClick={onBuyPressed}>
        BUY NVD Token
      </button>
      <p id="status">
        {status}
      </p>
    </div>
  );
};

export default Saler;
