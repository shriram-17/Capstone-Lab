"use client"
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

const Share = () => {
    const [email,setEmail] = useState<string | null>('')

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const emailParam = urlParams.get('email');
        setEmail(emailParam);
      }, []);

    return (
        <div>
            <Navbar userEmail={email}/>
            <h1>Hello World</h1>
        </div>
    )
}

export default Share;