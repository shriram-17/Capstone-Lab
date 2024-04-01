"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const Query = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [content, setContent] = useState('');
  const [email, setEmail] = useState<string | null>(null); // Initialize email state to null

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    setEmail(emailParam);
  }, []);

  useEffect(() => {
    const searchFieldEmail = async () => {
      if (email) {
        try {
          const url = `/api/file/${email}`;
          const response = await axios.get(url);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    searchFieldEmail();
  }, [email]);

  const runQuery = () => {
    console.log("Running query...");
  };

  return (
      <div className="flex flex-col">
        <div className="flex overflow-x-auto">
        </div>
        {selectedFile && (
            <div className="flex flex-col p-4 border border-gray-200 rounded">
              <h2 className="mb-4 text-lg font-bold">{selectedFile.fileName}</h2>
              <textarea className="mb-4 p-2 border border-gray-200 rounded" value={content} readOnly />
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={runQuery}>
                Run Query
              </button>
            </div>
        )}
      </div>
  );
};

export default Query;
