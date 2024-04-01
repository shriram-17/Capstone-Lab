"use client"

import { useState } from "react";

export default function Page() {
  const [sql,setSqlContent] = useState<string>("")
  
  const sqlOnChange = (event:any) => {
    setSqlContent(event?.target.value)
  }
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Enter text here"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
          Send
        </button>
      </div>
    </div>
  );
}
