
"use client"
import axios from 'axios';
import React, { useState } from 'react';

const QueryTextBox = () => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);

    const executeQuery = async () => {
        const response = await axios.post("http://localhost:8000/sql_query",query)
        const{result} = response.data
        setResult(result)
        setQuery(" ");
    };

    const newQuery = () => {
        setResult(null)
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <textarea
                placeholder="Type your query here..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="mb-4 p-2 border rounded h-2/4 w-3/4 shadow-lg"
            />    
            <div className='flex'>
                <button
                    onClick={executeQuery}
                    className="mb-4 p-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700 transition duration-200"
                >
                    Execute Query
                </button>
                <button onClick={newQuery}
                    className="ml-4 mb-4 p-2 bg-blue-500 text-white rounded shadow-lg hover:bg-blue-700 transition duration-200"
                >
                    New Query
                </button>
            </div>
            {result && (
                <div className="p-4 border rounded shadow-lg bg-white">
                    <h1 className="text-xl font-bold mb-2">Result:</h1>
                    {JSON.stringify(result)}
                </div>
            )}
        </div>
    );
};

export default QueryTextBox;
