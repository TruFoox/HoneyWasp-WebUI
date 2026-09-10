import { useEffect, useRef, useState } from 'react'

import mainLogo from './assets/Logo.svg'
import loadingImage from "./assets/loading.gif";


import './App.css'

function App() {
    // Apparently js variables need a setter defined alongside it for it to change dynamically w/ react
    const [connected, setConnected] = useState(false) // Usestate links the setter and the var itself
    const [config, setConfig] = useState<ConfigData | null>(null);
    const webUIVersion = "1.0"
    const [honeyWaspVersion, setHoneyWaspVersion] = useState<string>("ersion not fetched") // No v because it adds v to number later (eg v1.5)

    // Every useeffect referecess different instance of socket so ig so we need useref to keep it as one
    // Normally this would be used with a secondary variable but here we are treating socketref as socket, so I renamed it
    const socket = useRef<WebSocket | null>(null)

    useEffect(() => { // Set misc settings
        document.title = "HoneyWasp WebUI"; // Set title
    }, []);

    useEffect(() => { // "Run this when some event occurs"
        // Promise : value I need but don't have, but will expect to have before it's needed ; async allows use of promises & awaiting a value
        // Currently not using promise
        // Unsure of diff between this and "async function connect() {}"
        const connect = () => {
            socket.current = new WebSocket('ws://localhost:8080')

            if (socket.current == null) return

            socket.current.onopen = () => {
                setConnected(true)
                console.log('Connected to HoneyWasp')

                socket.current?.send('webui-ready')
            }

            socket.current.onmessage = (event) => { // Messages sent, other than first, in format Identifier.Data
                console.log('Server:', event.data)

                console.log('Server:', event.data)

                if (!event.data.includes("/")) {
                    setHoneyWaspVersion(event.data)
                    return
                }

                // Get purpose of data being sent & data
                const flag = event.data.substring(0, event.data.indexOf("/"))
                const data = event.data.substring(event.data.indexOf("/") + 1, event.data.length)

                switch (flag) { // Handle incoming messages
                    case "config":
                        console.log("Config updated")

                        setConfig(JSON.parse(data)) // Convert data to json and set as config
                        break;
                }

            }

            socket.current.onerror = (event) => {
                console.error('Websocket ERROR', event)
            }

            socket.current.onclose = (event) => {
                console.log('Websocket CLOSED', event.code, event.reason)

                setConnected(false)

                setTimeout(() => {
                    console.log('RETRYING...')
                    connect()
                }, 1000) // "Run that stuff after 1 second"
            }
        }



        connect()
    }, []) // [] means on startup after website renders

    useEffect(() => { // If website not rendering, something here is probably why
        if (!connected || !socket.current) return // If this is running because connected was initialized or websocket.current doesn't exist, quit

        const fetchConfig = () => {
            console.log("Requesting config")
            socket.current.send("send-config")
        }
//
        // Remove ts later. To stop compiler from bitching that config is unused
        const e = config;
        if (e == config) {}
        fetchConfig()
    }, [connected]); // Run once when website rendered/connected initialized, then again when connected

    return (
        <>
            {!connected ? (
                <>
                    <div className="sys-info">
                        <img src={mainLogo} className="logoImage" alt="HoneyWasp logo"/>
                        <div className="repo-info">
                            <text>TruFoox/HoneyWasp WebUI v{webUIVersion}</text>
                            <br/>
                            <text>HoneyWasp not found ✗</text>
                        </div>
                    </div>
                    <section id="center">
                        <div className="loadingScreen">
                            <img src={loadingImage}/>
                            <br/><br/>
                            <h2>Searching for HoneyWasp.</h2>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    <section id="config-display">
                    </section>
                    <div className="sys-info">
                        <img src={mainLogo} className="logoImage" alt="HoneyWasp logo"/>
                        <div className="repo-info">
                            <text>TruFoox/HoneyWasp WebUI v{webUIVersion}</text>
                            <br/>
                            <text>TruFoox/HoneyWasp v{honeyWaspVersion} connected ✓</text>
                        </div>
                    </div>
                </>

            )}
        </>
    )
}

type ConfigData = {
    General_Settings: {
        discord_bot_token: string;
        webhook_url: string;
        proxies: boolean;
        restart: boolean;
        debug_mode: boolean;
    };

    Instagram_Settings: {
        api_key: string;
        autostart: boolean;
        auto_post_mode: boolean;
        video_mode: boolean;
        minutes_between_posts: number;
        attempts_before_timeout: number;
        subreddits: string[];
        blacklist: string[];
        duplicates_allowed: boolean;
        nsfw_allowed: boolean;
        use_reddit_caption: boolean;
        caption_blacklist: string[];
        hours_before_duplicate_removed: number;
        audio_enabled: boolean;
        caption: string;
        hashtags: string;
    };

    Youtube_Settings: {
        refresh_token: string;
        client_secret: string;
        client_id: string;
        autostart: boolean;
        auto_post_mode: boolean;
        minutes_between_posts: number;
        attempts_before_timeout: number;
        subreddits: string[];
        blacklist: string[];
        duplicates_allowed: boolean;
        nsfw_allowed: boolean;
        use_reddit_caption: boolean;
        caption_blacklist: string[];
        hours_before_duplicate_removed: number;
        audio_enabled: boolean;
        caption: string;
        hashtags: string;
    };

    Tiktok_Settings: {
        refresh_token: string;
        client_secret: string;
        client_key: string;
        autostart: boolean;
        auto_post_mode: boolean;
        minutes_between_posts: number;
        attempts_before_timeout: number;
        subreddits: string[];
        blacklist: string[];
        duplicates_allowed: boolean;
        nsfw_allowed: boolean;
        use_reddit_caption: boolean;
        caption_blacklist: string[];
        hours_before_duplicate_removed: number;
        audio_enabled: boolean;
        caption: string;
        hashtags: string;
    };
};
export default App
