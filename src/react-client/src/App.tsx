import {useEffect, useState} from 'react'
import {Button} from "@/components/ui/button.tsx";

function App() {
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        async function getData() {
            const response = await fetch("/api");
            if (response.ok) {
                const data = await response.text();
                setMessage(data);
            }
        }

        getData();
    }, []);

    return (
        <>
            <Button onClick={() => setShowMessage(!showMessage)}>Show Message</Button>
            {showMessage && (
                <h1 className="text-8xl">From Server: {message.length > 0 ? message : "No message yet!"}</h1>
            )}
        </>
    )
}

export default App
