import React, { useState } from 'react'
import './App.css';
import { Connect } from './Connect'
import { BuyKey } from './BuyKey'

export const ProviderContext = React.createContext()

const App = () => {
  const [provider, setProvider] = useState(null)

  return (
    <ProviderContext.Provider value={{setProvider, provider}}>
      <div className="App">
        <header className="App-header">
          {/* Connect button */}
          {!provider && <Connect />}
          {/* Once connected, show the purchase button */}
          {provider && <BuyKey lockAddress="0x2032DfdaE9CFC68BB8Dbe627CF4423f5D4F9536C" />}
        </header>
      </div>
    </ProviderContext.Provider>
  );
}

export default App;
