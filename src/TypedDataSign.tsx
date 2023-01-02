
// All properties on a domain are optional
import { useState } from "react";
import { Button, Text } from "evergreen-ui";
import { ethers } from "ethers";
import { initPrompt } from "./common";

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
};

// The named list of all type definitions
const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' }
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' }
  ]
};

// The data to sign
const value = {
  from: {
    name: 'Cow',
    wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
  },
  to: {
    name: 'Bob',
    wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
  },
  contents: 'Hello, Bob!'
};

export default function TypedDataSign(props: { signFn: (...args: any[]) => Promise<string>, address: string }) {
  const [sig, setSig] = useState(initPrompt)
  const [valid, setValid] = useState(initPrompt)

  return <>
    <Text>[{valid}]{sig}</Text>
    <Button onClick={() => {
      props.signFn(domain, types, value).then(setSig)
      setValid(initPrompt)
    }}>Call Signature</Button>
    <Button onClick={() => {
      const address = ethers.utils.verifyTypedData(domain, types, value, sig)
      setValid(address === props.address ? "✅" : "❌")
    }}>Verify Signature</Button>
  </>;
}
