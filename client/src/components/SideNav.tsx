
import React from 'react';

interface SideNavProps {
    files: string[];
    selectedFile: string | null;
    handleFileSelect: (fileName: string) => void;
}

const SideNav: React.FC<SideNavProps> = ({ files, selectedFile, handleFileSelect }) => {
    return (
        <nav className="p-2">
            <div>
                <h6 className="text-lg font-bold">Recent files</h6>
                <ul className="mt-2">
                    {files?.map((file: string, index: number) => (
                        <li
                            key={index}
                            onClick={() => handleFileSelect(file)}
                            className={`cursor-pointer px-4 py-2 text-sm rounded mb-2 ${selectedFile === file ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            {file}
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default SideNav;
