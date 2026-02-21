const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());
app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*"); // CORS
  next();
});

const USDC_MINT="EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

app.get("/usdc/:address", async (req,res)=>{
  try{
    const address=req.params.address;
    const response = await fetch("https://api.mainnet-beta.solana.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc:"2.0",
        id:1,
        method:"getTokenAccountsByOwner",
        params:[
          address,
          {mint:USDC_MINT},
          {encoding:"jsonParsed"}
        ]
      })
    });
    const data = await response.json();
    // Sumujemy wszystkie konta tokena USDC
    let balance=0;
    if(data.result.value){
      for(const acct of data.result.value){
        balance += parseInt(acct.account.data.parsed.info.tokenAmount.amount);
      }
    }
    res.json({balance}); // balance w najmniejszych jednostkach (6 decimals)
  }catch(e){
    res.status(500).json({error:"RPC failed"});
  }
});

app.listen(process.env.PORT||3000,()=>console.log("Backend działa"));
