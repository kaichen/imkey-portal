import { Button, Label, Pane, Select, Text, TextInput, TextInputField } from "evergreen-ui";

import { ImKeyKeyring } from "@imkey/web3-provider"
import type { SerializationOptions } from "@imkey/web3-provider";
import { useCallback, useState } from "react";
import Section from "./Section";

function Keyring() {
  const [keyring, setKeyring] = useState<ImKeyKeyring | null>(null)
  const [keys, setKeys] = useState<SerializationOptions>({})
  const [address, setAddress] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>("Hello World")
  const [result, setResult] = useState<string | null>(null)

  const handleConnect = useCallback(() => {
    console.log('handleConnect', keyring, keys)
    if (!keyring) {
      const k = new ImKeyKeyring({
        deviceId: "imKey Pro",
      })
      k.setTransport().then(() => {
        setKeyring(k)
      })
    }
  }, [keyring])

  const handleAddAccount = useCallback(() => {
    console.log('handleAddAccount', keyring, keys)
    keyring && keyring.addAccounts(1).then(() => {
      keyring.serialize().then(setKeys)
    })
  }, [keyring, keys])

  const handleAddressChange = useCallback((e: any) => {
    setAddress(e.target.value)
  }, [address])

  const handleMessageChange = useCallback((e: any) => {
    setMessage(e.target.value)
  }, [message])

  const handleSignMessage = useCallback((e: any) => {
    e.preventDefault()
    console.log('handleSignMessage', address, message)
    keyring && address && keyring.signMessage(address, message).then(setResult)
  }, [address, message])

  return (
    <Pane clearfix={true}>
      <Pane>
        <Text>testing keyring protocol</Text>
      </Pane>
      <Section title="Connect">
        <Button onClick={handleConnect} disabled={!!keyring}>Connect</Button>
      </Section>

      <Section title="Accounts">
        {keys.accounts && keys.accounts.map((acc: { address: string }, i: number) => {
          return <Pane key={i}><Text fontFamily="monospace">({i}){acc.address}</Text></Pane>
        })}
        <Pane marginTop="1rem"><Button onClick={handleAddAccount} disabled={!keyring}>Add Account</Button></Pane>
      </Section>

      <Section title="Signature">
        <form onSubmit={handleSignMessage}>
          {keys.accounts &&
            <Pane className="field-group">
              <Select onChange={handleAddressChange}>
                {keys.accounts && keys.accounts.map((acc: { address: string }, i: number) => {
                  return (<option value={acc.address} key={i}>{acc.address}</option>)
                })}
              </Select>
            </Pane>}
          <Pane className="field-group">
            <TextInput placeholder="Message to sign" onChange={handleMessageChange} />
          </Pane>
          <Button onClick={handleSignMessage}>Sign Message</Button>
        </form>
        {result && <Text fontFamily="monospace" className="signature-zone" border="1">Signature: {result}</Text>}
      </Section>
    </Pane>
  )
}

export default Keyring
