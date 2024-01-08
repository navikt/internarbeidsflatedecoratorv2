import React from 'react'
import Decorator from 'http://localhost:4173/bundle.js'

function App() {
  return (
    <>
      <div className="w-full top-0">
        <Decorator
          appName="Test app"
          markup={{ etterSokefelt: '<button>Min knapp</button>' }}
          enableHotkeys
          showEnhet={false}
          showEnheter={false}
          showSearchArea={false}
          showHotkeys={true}
          environment={'q2'}
          urlFormat={'LOCAL'}
          veiledersIdent='12345'
          onEnhetChanged={console.log}
          onFnrChanged={console.log}
        />
      </div>
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        Dette er en test app som bruker vite
      </div>
    </>
  )
}

export default App
