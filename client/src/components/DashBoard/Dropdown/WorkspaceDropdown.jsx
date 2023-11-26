import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WorkspaceDropdown = () => {
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspace, setSelectedWorkspace] = useState('');

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await axios.get('http://localhost:9000/api/users/user-workspaces'); // Pfad anpassen
                setWorkspaces(response.data);
                setSelectedWorkspace(response.data[0]._id); // Erster Workspace als Standard
            } catch (error) {
                console.error('Fehler beim Abrufen der Workspaces', error);
            }
        };
        fetchWorkspaces();
    }, []);

    const handleSelectionChange = (event) => {
        setSelectedWorkspace(event.target.value);
    };

    return (
        <div className="flex flex-col p-4 bg-gray-100 rounded-lg shadow-md">
            <label htmlFor="workspace-select" className="mb-2 text-lg font-medium text-gray-700">Webdesk:</label>
            <select id="workspace-select" value={selectedWorkspace} onChange={handleSelectionChange} className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300">
                {workspaces.map(workspace => (
                    <option key={workspace._id} value={workspace._id}>{workspace.name}</option>
                ))}
            </select>
        </div>
    );
};

export default WorkspaceDropdown;
