import { useEffect, useState } from 'react'
import mainLogo from './assets/Logo.svg'
import './App.css'
function App() {
    // Apparently js variables need a setter defined alongside it for it to change dynamically w/ react
    const [connected, setConnected] = useState(false) // Usestate links the setter and the var itself
    const webUIVersion = "v1.0"
    const [honeyWaspVersion, setHoneyWaspVersion] = useState<string>("Not Fetched")

    let socket: WebSocket // equal to WebSocket socket;

    useEffect(() => { // "Run this when something happens"
        socket = new WebSocket('ws://localhost:8080')

        socket.onopen = () => {
            console.log('Connected to HoneyWasp server')
            socket.send('WebUI ready')
        }

        socket.onmessage = (event) => {
            console.log('Server:', event.data)

            if (event.data === 'Acknowledged') {
                setConnected(true)
            } else {
                setHoneyWaspVersion(event.data)
            }
        }

        return () => {
            socket.close()
        }
    }, []) // [] means on startup after website renders

    useEffect(() => {
        if (connected) {

            socket.send(honeyWaspVersion)
            setHoneyWaspVersion(honeyWaspVersion);
        }
    }, [connected]) // "Send once connected is true"

    return (
        <>
        {!connected ? (
                <section id="bottom-left">
                    <div className="logo">
                        <img src={mainLogo} className = "logoImage" alt="HoneyWasp logo" />
                        <span className="repoinfo">TruFoox/HoneyWasp WebUI {webUIVersion}</span>
                    </div>
                </section>
            ) : (
                <section id="bottom-left">
                    <div className="logo">
                        <img src={mainLogo} className = "logoImage" alt="HoneyWasp logo" />
                        <div className="repoText">
                            <span className="repoinfo">TruFoox/HoneyWasp WebUI {webUIVersion}</span>
                            <br />
                            <span className="repoinfo">TruFoox/HoneyWasp {honeyWaspVersion} connected ✓</span>
                        </div>
                    </div>
                </section>

            )}
        </>
    )
}

export default App
