import { useState } from "react";
import { Pane, Text, SidebarTab, Tablist  } from "evergreen-ui";

import './App.css'
import Provider from "./Provider";
import Keyring from "./Keyring";

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabs] = useState(['Provider', 'Keyring'])

  return (
    <Pane>
      <Pane borderBottom={true} borderBottomColor="#ccc" padding="1rem" marginBottom="1rem">
        <Text fontSize="3rem">imKey Portal</Text>
      </Pane>

      <Pane display="flex">
        <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
          {tabs.map((tab, index) => (
            <SidebarTab
              key={tab}
              id={tab}
              onSelect={() => setSelectedIndex(index)}
              isSelected={index === selectedIndex}
              aria-controls={`panel-${tab}`}
            >
              {tab}
            </SidebarTab>
          ))}
        </Tablist>
        <Pane padding={16} flex="1" width={0}>
          {tabs.map((tab, index) => (
            <Pane
              key={index}
              id={`panel-${tab}`}
              role="tabpanel"
              aria-labelledby={tab}
              aria-hidden={index !== selectedIndex}
              display={index === selectedIndex ? 'block' : 'none'}
            >
              {index === 0 ?  <Provider /> : <Keyring />}
            </Pane>
          ))}
        </Pane>
      </Pane>
    </Pane>
  )
}

export default App
