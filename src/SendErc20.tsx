import { Button, Text, TextInput } from "evergreen-ui";
import { useState } from "react";
import { ethers } from "ethers";

type TxResp = ethers.providers.TransactionResponse

const iface = new ethers.utils.Interface(["function transfer(address to, uint256 value) external returns (bool)"])

export default function SendErc20(props: { sendTxFn: (_: any) => Promise<TxResp> }) {
  const [txResp, setTxResp] = useState<null | TxResp>(null)
  const [token, setToken] = useState("0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1") // dummy erc20 on mumbai
  const [to, setTo] = useState("0x19977768701688fc359f7418f30d4be051dbc9c8") // a random address from explorer
  const [amount, setAmount] = useState("1.234")

  return <>
    <TextInput name="text-input-erc20" placeholder="Token Address..." value={token} onChange={(e: any) => setToken(e.target.value)}/>
    <TextInput name="text-input-recipient" placeholder="0x..." value={to} onChange={(e: any) => setTo(e.target.value)}/>
    <TextInput name="text-input-amount" placeholder="Amount..." value={amount} onChange={(e: any) => setAmount(e.target.value)}/>

    <Button onClick={() => {
      if (ethers.utils.isAddress(token) && ethers.utils.isAddress(to)) {
        props.sendTxFn({
          to: token,
          data: iface.encodeFunctionData("transfer", [to, ethers.utils.parseEther(amount)]),
          value: 0,
          type: 0,
        }).then(setTxResp)
      } else {
        alert("Invalid to address or token address")
      }
    }}>Send</Button>

    {txResp && <Text>TxHash: {txResp.hash}</Text>}
    {txResp && txResp.confirmations > 0 && <Text>Block: {txResp.blockNumber}</Text>}
  </>;
}
