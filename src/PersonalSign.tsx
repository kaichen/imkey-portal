import { Button, Card, Text } from "evergreen-ui";
import { useState } from "react";
import { ethers } from "ethers";
import { initPrompt } from "./common";

function ecrecoverPeronalSign(message: string, signature: string): string | null {
  if (signature.length !== 132) {
    return null
  }
  return ethers.utils.verifyMessage(message, signature);
}

const testSignMsg = "Hello, ImKey! Now is " + new Date().toLocaleString()

export default function PersonalSign(props: { signFn: (_: string) => Promise<string>, address: string }) {
  const [sig, setSig] = useState(initPrompt)
  const [valid, setValid] = useState(initPrompt)

  return <>
    <Text>[{valid}]{sig}</Text>
    <Button onClick={() => {
      props.signFn(testSignMsg).then(setSig)
      setValid(initPrompt)
    }}>Call Signature</Button>
    <Button onClick={() => {
      const address = ecrecoverPeronalSign(testSignMsg, sig)
      const invalid = address !== null && address !== ethers.utils.getAddress(props.address)
      console.log("validate signature>>>", "address", address, "props.address", props.address)
      setValid(invalid ? "❌" : "✅")
    }}>Verify Signature</Button>
  </>;
}
