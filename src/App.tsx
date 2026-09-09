import { useEffect, useRef, useState } from 'react'

import mainLogo from './assets/Logo.svg'
import loadingImage from "./assets/loading.gif";


import './App.css'
function App() {
    // Apparently js variables need a setter defined alongside it for it to change dynamically w/ react
    const [connected, setConnected] = useState(false) // Usestate links the setter and the var itself
    const webUIVersion = "v1.0"
    const [honeyWaspVersion, setHoneyWaspVersion] = useState<string>("Not Fetched")

    const socketRef = useRef(null) // Use socketRef.current when referencing

    useEffect(() => { // "Run this when something happens"
        const socket = new WebSocket('ws://localhost:8080')
        socketRef.current = socket

        socket.onopen = () => {
            console.log('Connected to HoneyWasp server')
            socket.send('WebUI ready')
        }

        socket.onmessage = (event) => {
            console.log('Server:', event.data)

            if (event.data === 'connected') {
                setConnected(true)
            } else {
                setHoneyWaspVersion(event.data)
            }
        }

        socket.onerror = (event) => {
            console.error('WEBSOCKET ERROR', event)
        }

        socket.onclose = (event) => {
            console.log('WEBSOCKET CLOSED', event.code, event.reason)
        }

        return () => {
            socket.close()
        }
    }, []) // [] means on startup after website renders

    return (
        <>
        {!connected ? (
            <>
                <section id="bottom-left">
                    <div className="sysinfo">
                        <img src={mainLogo} className="logoImage" alt="HoneyWasp logo"/>
                        <span className="repoinfo">TruFoox/HoneyWasp WebUI {webUIVersion}</span>
                    </div>
                </section>
                <section id="center">
                    <div className="loadingScreen">
                        <img src={loadingImage}/>
                        <div className="repoText"></div>
                    </div>
                </section>
            </>
        ) : (
            <section id="bottom-left">
                <div className="sysinfo">
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
