"use client"
import axios from "axios"
import React, { useEffect } from "react"

export default function Sample () :React.FC   {

    const fetchData = async(email:string) => {
        const response = await axios.get(`/api/user/${email}`)
        console.log(response.data)
    }
    let email ="20pw33@psgtech.ac.in"
    useEffect(()=>{
       
        fetchData(email)
    },[])

    return (
        <div>
        </div>
    )
}