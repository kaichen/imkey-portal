import { useEffect, useState } from 'react'
import { ImKeyProvider } from "@imkey/web3-provider"
import { Button, Link, majorScale, Pane, Text } from "evergreen-ui";
import { ethers } from 'ethers'

import './App.css'
import PersonalSign from "./PersonalSign";
import Section from "./Section";
import TypedDataSign from "./TypedDataSign";
import SendEther from './SendEther'
import SendErc20 from './SendErc20'

function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainID, setChainID] = useState<number | null>(null)

  const imKeyProvider = new ImKeyProvider({
    // == mumbai
    rpcUrl: "https://rpc-mumbai.maticvigil.com",
    chainId: 80001,
    // == bsc testnet
    // rpcUrl: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
    // chainId: 97,
    // == xdai
    // rpcUrl: "https://rpc.gnosischain.com/",
    // chainId: 100,
    // == xdai testnet
    // rpcUrl: 'https://rpc.chiadochain.net',
    // chainId: 10200,
  })
  const provider = new ethers.providers.Web3Provider(imKeyProvider)
  // provider.on('debug', (info) => {
  //   console.log(info)
  // })
  const signer = provider.getSigner();

  useEffect(() => {
    provider.getNetwork().then((network) => {
      setChainID(network.chainId)
    })
  })

  // @ts-ignore
  return (
    <Pane display="flex" alignItems="center" flexDirection="column" marginX={majorScale(2)}>
      <Text fontSize={32} fontWeight={700} marginBottom="3rem">imKey Portal</Text>

      <Section title="Status">
        <Text>ChainID: {chainID}</Text>
      </Section>

      <Section title="Get Address">
        <Text>Address: {address}</Text>
        <Text>Balance: {balance}</Text>
        {balance && balance === "0.0" && <Text>Go to faucet webpage to get some tokens</Text>}
        <Button onClick={() => {
          signer.getAddress().then(setAddress)
        }}>Get Address</Button>
        <Button onClick={() => {
          if (address) {
            provider.getBalance(address).then((bal) => {
              setBalance(ethers.utils.formatEther(bal))
            })
          }
        }}>Get Balance</Button>
      </Section>

      <Section title="Personal Sign">
        <PersonalSign signFn={(msg) => signer.signMessage(msg)}
                      address={address as string}/>
      </Section>

      <Section title="Typed Data Sign">
        <TypedDataSign signFn={(domain, types, value) => signer._signTypedData(domain, types, value)}
                       address={address as string}/>
      </Section>

      <Section title="Send Ether">
        <SendEther sendTxFn={(tx) => signer.sendTransaction(tx)} address={address as string}/>
      </Section>

      <Section title="Send ERC20">
        <SendErc20 sendTxFn={(tx) => signer.sendTransaction(tx)}/>
      </Section>
    </Pane>
  )
}

export default App
