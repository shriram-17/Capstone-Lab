"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "@/components/Navbar";
import {  getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseApp } from '../../../lib/firebaseclient';
import {  FilePayload} from '../../../lib/types';
import { User } from '.prisma/client';


export default  function FileUpload(): JSX.Element {

    const [email,setEmail] = useState<string| null>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>('');


    useEffect(()=> {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        setEmail(email)
    },[])
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setFileName(event.target.files[0].name); 
        }
    };

    const getUserNameByEmail = async (email: string | null): Promise<User> => {
        if (email) {
            const response = await axios.get(`/api/user/${email}`);
            const { user } = response.data;
            return user;
        }
        throw new Error("Email cannot be null"); 
    };
    

    const storeFile = async (file:FilePayload) => {
        console.log(file)
        const response = await axios.post("/api/file",file);
        console.log(response.data)
    };

    const handleUpload = async () => {
        if (selectedFile) {
            try {
                let user = await getUserNameByEmail(email);
               /* const storage = getStorage(firebaseApp);
                let filename = selectedFile.name+"_"+email
                const storageRef = ref(storage,filename);
                await uploadBytes(storageRef, selectedFile);
                */
                const formData = new FormData();
                formData.append('sql_file', selectedFile);
                formData.append('email',user.email)
                const response = await axios.post('http://localhost:8000/sql', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });
                
                console.log("Response:", response.data);
             
              //storeFile({...user,filename})
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setSelectedFile(null);
                setFileName('');
                if (document.getElementById('fileInput')) {
                    (document.getElementById('fileInput') as HTMLInputElement).value = '';
                }
            }
        } else {
            alert("Please select a file.");
        }
    };
    

    return (<div>
            <Navbar userEmail={email}/>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
                <div className="max-w-md w-full p-6 bg-white shadow-2xl rounded-xl">
                    <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">Upload SQL Dump File</h1>
                    <div className="flex items-center justify-center space-x-4">
                        <label htmlFor="fileInput" className="inline-block px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded cursor-pointer">
                            {fileName ? fileName : "Select File"}
                        </label>
                        <input
                            id="fileInput"
                            type="file"
                            accept=".sql"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleUpload}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
