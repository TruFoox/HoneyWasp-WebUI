import { useEffect, useRef, useState } from 'react'

import mainLogo from './assets/Logo.svg'
import loadingImage from "./assets/loading.gif";


import './App.css'
function App() {
    // Apparently js variables need a setter defined alongside it for it to change dynamically w/ react
    const [connected, setConnected] = useState(false) // Usestate links the setter and the var itself
    const webUIVersion = "v1.0"
    const [honeyWaspVersion, setHoneyWaspVersion] = useState<string>("Not Fetched")

    const socketRef = useRef<WebSocket | null>(null); // Remember to use socketRef.current when referencing

    useEffect(() => { // "Run this when some event occurs"
        const connect = () => {
            const socket = new WebSocket('ws://localhost:8080')
            socketRef.current = socket

            socket.onopen = () => {
                console.log('Connected to HoneyWasp server')
                socket.send('WebUI ready')
            }

            socket.onmessage = (event) => {
                console.log('Server:', event.data)

                if (connected == false) {
                    setHoneyWaspVersion(event.data)
                    setConnected(true)
                }
            }

            socket.onerror = (event) => {
                console.error('WEBSOCKET ERROR', event)
            }

            socket.onclose = (event) => {
                console.log('WEBSOCKET CLOSED', event.code, event.reason)

                setConnected(false)

                setTimeout(() => {
                    console.log('RETRYING...')
                    connect()
                }, 1000) // "Run that stuff after 1 second"
            }
        }

        connect()
    }, []) // [] means on startup after website renders

    return (
        <>
        {!connected ? (
            <>
                <section id="bottom-left">
                    <div className="sysinfo">
                        <img src={mainLogo} className="logoImage" alt="HoneyWasp logo"/>
                        <div className="repoinfo">
                            <text>TruFoox/HoneyWasp WebUI v{webUIVersion}</text>
                            <br/>
                            <text>HoneyWasp not found ✗</text>
                        </div>
                    </div>
                </section>
                <section id="center">
                    <div className="loadingScreen">
                        <img src={loadingImage}/>
                        <br/><br/>
                        <h2>Searching for HoneyWasp.</h2>
                    </div>
                </section>
            </>
        ) : (
            <section id="bottom-left">
                <div className="sysinfo">
                    <img src={mainLogo} className = "logoImage" alt="HoneyWasp logo" />
                    <div className="repoinfo">
                        <text>TruFoox/HoneyWasp WebUI v{webUIVersion}</text>
                        <br/>
                        <text>TruFoox/HoneyWasp v{honeyWaspVersion} connected ✓</text>
                    </div>
                </div>
            </section>

        )}
        </>
    )
}

export default App
