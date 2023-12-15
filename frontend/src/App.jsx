import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";

function App() {
  const [account, setAccount] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessVerify, setAccessVerify] = useState("");


  const connect = async () => {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.w3 = new Web3(window.ethereum);
      let accounts = await w3.eth.getAccounts();

      setAccount(accounts[0]);
      let accessToken1 = await authenticate();
      setAccessToken(accessToken1);
    }
  };

  const authenticate = async () => {
    let res = await fetch(`http://127.0.0.1:3000/nonce?address=${account}`);
    let resBody = await res.json();
    console.log(await resBody);

    let signature = await w3.eth.personal.sign(resBody.message, account);

    console.log(signature);

    let opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resBody.tempToken}`,
      },
    };

    res = await fetch(
      `http://127.0.0.1:3000/verify?signature=${signature}`,
      opts
    );
    resBody = await res.json();
    console.log(resBody);
    return resBody.token;
  };

  const RuterApp = async () => {

    let opts = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    let res = await fetch(`http://127.0.0.1:3000/secret`, opts);

    let respnse = await res.text()
    console.log(respnse);
    setAccessVerify(respnse);
  };

  useEffect(() => {}, [account, accessToken,accessVerify]);

  return (
    <>
      <div>Account: {account}</div>
      <div>Token: {accessToken}</div>
      <div>ACCESSS: {accessVerify}</div>
      
      <div>
        <button onClick={connect}>Wallet Connect</button>
        <button onClick={RuterApp}>Change Rute</button>
      </div>
    </>
  );
}

export default App;
