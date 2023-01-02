import { Button, Select, Text, TextInput } from "evergreen-ui";
import { useState } from "react";
import { ethers } from "ethers";

type TxResp = ethers.providers.TransactionResponse

export default function SendEther(props: { sendTxFn: (_: any) => Promise<TxResp>, address: string }) {
  const [txResp, setTxResp] = useState<null | TxResp>(null)
  const [to, setTo] = useState<string>("0x19977768701688fc359f7418f30d4be051dbc9c8") // a random address from explorer
  const [amount, setAmount] = useState<string>("0.0001")
  const [txType, setTxType] = useState<string>('0')

  return <>
    <TextInput name="text-input-recipient" placeholder="0x..." value={to} onChange={(e: any) => setTo(e.target.value)}/>
    <TextInput name="text-input-amount" placeholder="Amount" value={amount} onChange={(e: any) => setAmount(e.target.value)}/>
    <Select onChange={e => setTxType(e.target.value)} defaultValue="0">
      <option value="0">Type-0</option>
      <option value="1">Type-1(eip2718)</option>
      <option value="2">Type-2(eip1559)</option>
    </Select>
    <Button onClick={() => {
      props.sendTxFn({
        from: props.address,
        to: to,
        value: ethers.utils.parseEther(amount).toNumber(),
        type: parseInt(txType),
        data: '0x',
      }).then(setTxResp)
    }}>Send</Button>
    {txResp && <Text>TxHash: {txResp.hash}</Text>}
    {txResp && txResp.confirmations > 0 && <Text>Block: {txResp.blockNumber}</Text>}
  </>;
}
