import mainLogo from './assets/Logo.svg'

import './App.css'
function App() {

    /* Ignore errors on IntelliJ, boy is it stupid. */
  return (
    <>
    <section id="bottom-left">
        <div className="logo">
          <img src={mainLogo} className = "logoImage" alt="HoneyWasp logo" />
          <span className="repoinfo">TruFoox/HoneyWasp WebUI v1.0</span>
        </div>
    </section>
    <section id="center">
        <div>
            <h1>Hi</h1>
            <p>
               Hi <code>nerd</code>
            </p>
        </div>
    </section>
    </>
  )
}

export default App
