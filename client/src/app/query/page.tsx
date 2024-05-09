"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "@/components/Navbar";
import QueryTextBox from './components/QueryTextBox';

const Query = () => {
  const [data, setData] = useState<any>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [resultContent, setresultContent] = useState<string[] | null>(null);
  const [showQuery, setShowQuery] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (email) {
        try { 
          const url = `/api/file/${email}`;
          const response = await axios.get(url);
          const {user} = response.data;
          setData(user);

        } catch (error) {
          console.error(error);
        }
      }
    };

    const debouncedEmail = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      clearTimeout(debouncedEmail);
    };
  }, [email]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    setEmail(emailParam);
  }, []);

  const filenameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.value);
    setFileContent(event.target.value);
  }

  const getFile = async (fileName: string) => {
    try {
      let name = `${fileName}`;
      setShowQuery(false)
      const url = `/api/${name}`;
      const response = await axios.get(url);
      const modifiedFileName = fileName.replace(`_${email}`, '');
      const fileResponse = await axios.get(`http://localhost:8000/queries?file_name=${modifiedFileName}`)
      setFileContent(response.data);
      //console.log(response.data)
      const {queries} = fileResponse.data
      console.log(fileResponse.data)
      //console.log(queries[0][2])
      setresultContent(queries[0][2])
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Navbar userEmail={email}/>
      <div className="flex">
        <div className="w-72 border-r border-gray-300">
          <div className="border-b border-gray-300"></div>
          <nav className="p-2">
            <div>
              <h6 className="text-lg font-bold">Recent files</h6>
              <ul className="mt-2">
                <li
                  className="cursor-pointer px-4 py-2 text-sm rounded mb-2 bg-gray-200 text-gray-800 font-mono"
                  onClick={() => setShowQuery(true)}
                >
                  New Query
                </li>
                {data && data.sqlFiles && data.sqlFiles.map((file: any, index: number) => {
                  const modifiedFileName = file.fileName.replace(`_${email}`, '');
                  return (
                    <li
                      key={index}
                      className={`cursor-pointer px-4 py-2 text-sm rounded mb-2 ${selectedFile === file.fileName ? 'bg-blue-500 text-white font-mono' : 'bg-slate-200 text-gray-800 font-mono'}`}
                      onClick={() => getFile(file.fileName)} 
                    >
                      {modifiedFileName}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
        <div className="flex-1">
          {showQuery ? <QueryTextBox/> : (
            <>
              <div className="p-4 overflow-x-auto" style={{ fontFamily: 'Courier New, monospace' }}>
                <pre className="whitespace-pre-wrap bg-slate-100 rounded-lg p-4 border border-teal-200 font-sans">
                  {fileContent}
                </pre>
              </div>
              <div className="flex-1">
                <div className="p-4 overflow-x-auto" style={{ fontFamily: 'Courier New, monospace' }}>
                  <pre className="whitespace-pre-wrap bg-slate-100 rounded-lg p-4 border border-teal-200 font-sans">
                    <h6 className="text-lg font-bold mb-2">Result</h6>
                    {resultContent}
                  </pre>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Query;
