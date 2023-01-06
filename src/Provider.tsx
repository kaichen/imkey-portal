import { useCallback, useEffect, useState } from 'react'
import { ImKeyProvider } from "@imkey/web3-provider"
import { Button , majorScale, Pane, Text } from "evergreen-ui";
import { ethers } from 'ethers'

import PersonalSign from "./PersonalSign";
import Section from "./Section";
import TypedDataSign from "./TypedDataSign";
import SendEther from './SendEther'
import SendErc20 from './SendErc20'

function Provider() {
  const [provider, setProvider] = useState<null | ImKeyProvider>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [chainID, setChainID] = useState<number | null>(null)

  useEffect(() => {
    provider && provider.getNetwork().then(({ chainId }: { chainId: number }) => {
      setChainID(chainId)
    })
  })

  const handleConnect = useCallback(() => {
    const imKeyProvider = new ImKeyProvider({
      // == mumbai
      // rpcUrl: "https://rpc-mumbai.maticvigil.com",
      // chainId: 80001,
      // == bsc testnet
      rpcUrl: 'https://data-seed-prebsc-2-s3.binance.org:8545/',
      chainId: 97,
      // == xdai
      // rpcUrl: "https://rpc.gnosischain.com/",
      // chainId: 100,
      // == xdai testnet
      // rpcUrl: 'https://rpc.chiadochain.net',
      // chainId: 10200,
    })
    setProvider(new ethers.providers.Web3Provider(imKeyProvider))
    // provider.on('debug', (info) => {
    //   console.log(info)
    // })
  }, [provider])

  const handleGetAddress = useCallback(() => {
    provider && provider.getSigner().getAddress().then(setAddress)
  }, [provider, address])

  const handleGetBalance = useCallback(() => {
    provider && address &&
      provider.getBalance(address).then((bal: any) => {
        setBalance(ethers.utils.formatEther(bal))
      })
  }, [provider, address, balance])

  // @ts-ignore
  return (
    <Pane display="flex" alignItems="center" flexDirection="column" marginX={majorScale(2)}>
      <Pane>
        <Text>testing eip1193 provider</Text>
      </Pane>

      <Section title="Status">
        <Button onClick={handleConnect} disabled={provider}>Connect</Button>
        <Text>ChainID: {chainID}</Text>
      </Section>

      <Section title="Get Address">
        <Text>Address: {address}</Text>
        <Text>Balance: {balance}</Text>
        {balance && balance === "0.0" && <Text>Go to faucet webpage to get some tokens</Text>}
        <Button onClick={handleGetAddress}>Get Address</Button>
        <Button onClick={handleGetBalance}>Get Balance</Button>
      </Section>

      <Section title="Personal Sign">
        <PersonalSign signFn={(msg) => provider && provider.getSigner().signMessage(msg)}
                      address={address as string}/>
      </Section>

      <Section title="Typed Data Sign">
        <TypedDataSign signFn={(domain, types, value) => provider && provider.getSigner()._signTypedData(domain, types, value)}
                       address={address as string}/>
      </Section>

      <Section title="Send Ether">
        <SendEther sendTxFn={(tx) => provider && provider.getSigner().sendTransaction(tx)} address={address as string}/>
      </Section>

      <Section title="Send ERC20">
        <SendErc20 sendTxFn={(tx) => provider && provider.getSigner().sendTransaction(tx)}/>
      </Section>
    </Pane>
  )
}

export default Provider
