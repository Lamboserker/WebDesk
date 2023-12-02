import React, { useState } from "react";
import {
    PlusIcon,
    VideoCameraIcon,
  } from "@heroicons/react/24/outline";
  
const SideBar = () => {
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceDescription, setWorkspaceDescription] = useState("");
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const dividerStyle = "relative w-60 h-px bg-gray-400 my-4";
  const [channels, setChannels] = useState([]);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [userData, setUserData] = useState({ sender: "", senderImage: "" });
  const [members, setMembers] = useState([]);

// Fetch all channels from the server
const fetchChannels = async (workspaceId) => {
    const token = localStorage.getItem("userToken");
    try {
      const response = await axios.get(
        `http://localhost:9000/api/workspaces/${workspaceId}/channels`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setChannels(response.data);
    } catch (error) {
      console.error("Error fetching channels:", error);
    }
  };


  const fetchWorkspaceMembers = async () => {
    console.log("Aufruf von fetchWorkspaceMembers mit:", selectedWorkspace);
    if (!selectedWorkspace || !selectedWorkspace._id) {
      console.error("Kein ausgewählter Workspace oder Workspace ID fehlt.");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const workspaceId = selectedWorkspace._id;
      const response = await axios.get(
        `http://localhost:9000/api/workspaces/${workspaceId}/users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching workspace members:", error);
    }
  };

  const openVideoModal = () => {
    setIsVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
  };



  const createWorkspace = () => {
    closeWorkspaceModal();
  };

  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);

  const handleCreateChannel = () => {
    setIsCreatingChannel(true);
  };

  const saveNewChannel = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const workspaceId = selectedWorkspace._id;
      // console.log(selectedWorkspace._id);
      if (!workspaceId) {
        console.error("No workspace selected");
        return;
      }

      const response = await axios.post(
        `http://localhost:9000/api/workspaces/${workspaceId}/create-channel`,
        {
          name: newChannelName,
          workspaceId: workspaceId,
          messages: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data);
      await fetchChannels();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle workspace change
  const changeWorkspace = (workspace) => {
    setSelectedWorkspace(workspace);
    localStorage.setItem("lastVisitedWorkspaceId", workspace._id);
    fetchChannels(workspace._id);
  };
  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    console.log("Is it open?", isDropdownOpen);
  };


  return (
    <>
      {/* sidebar */}
      <div className="flex flex-col  text-white w-64 mt-16  ">
        {isWorkspaceModalOpen && (
          <div className="workspace-modal">
            <div className="workspace-modal-content">
              <input
                type="text"
                placeholder="Workspace Name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
              <textarea
                placeholder="Workspace Description"
                value={workspaceDescription}
                onChange={(e) => setWorkspaceDescription(e.target.value)}
              />
              <button onClick={createWorkspace}>Create Workspace</button>
              <button onClick={closeWorkspaceModal}>Close</button>
            </div>
          </div>
        )}

        {/* Primary Navigation */}
        <div className="flex flex-col px-4 mt-2">
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Threads
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left">
            Files
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700">
            Mentions & reactions
          </button>
          {/* ... more primary navigation items */}
        </div>

        {/* Channels Section */}
        <div className="px-4 mt-2 relative">
          <div className={dividerStyle}></div>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-gray-500 uppercase z-auto mb-5">
              Channels
            </h2>
            <button
              onClick={handleCreateChannel}
              className="hover:bg-gray-700 rounded"
            >
              <PlusIcon className="h-5 w-5 text-white" />
            </button>
          </div>
          {/* Dialog oder Formular für neue Channel-Erstellung */}
          {isCreatingChannel && (
            <div>
              <input
                className="text-black"
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
              />
              <button onClick={saveNewChannel}>Channel erstellen</button>
            </div>
          )}

          {/* List of channels */}
          {channels.map((channel) => (
            <div
              key={channel._id}
              className="flex items-center justify-between py-2 text-sm font-medium hover:bg-gray-700"
            >
              <button onClick={() => handleChannelClick(channel._id)}>
                # {channel.name}
              </button>
              <button onClick={openVideoModal}>
                <VideoCameraIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          ))}
        </div>

        {isVideoModalOpen && (
          <Modal isToggled={isVideoModalOpen} onClose={closeVideoModal}>
            <VideoApp />
          </Modal>
        )}
        {/* Direct Messages Section */}
        <div className="px-4  mt-24">
          <div className={dividerStyle}></div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Direct Messages
          </h2>
          {/* List of DMs */}
          <div className="space-y-1">
            {members.map((member, index) => (
              <button
                key={index}
                className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left"
              >
                {member.name}{" "}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Navigation/Footer */}
        <div className="px-4  space-y-1 mt-48">
          <div className={dividerStyle}></div>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left">
            Preferences
          </button>
          <button className="flex items-center py-2 text-sm font-medium hover:bg-gray-700 w-full text-left">
            Help
          </button>
        </div>
        {/* User Profile Section */}
        <div className="mt-auto px-4 py-2">
          <div className="flex items-center space-x-3">
            {!imageLoadError && userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-gray-300 object-cover"
                onError={() => setImageLoadError(true)}
              />
            ) : (
              <div className="h-10 w-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
                <span className="text-xs">User</span>
              </div>
            )}
            <span className="text-sm font-medium">{userData.name}</span>
          </div>
        </div>
      </div>
         {/* Workspace Dropdown */}
         <WorkspaceDropdown onSelectWorkspace={changeWorkspace} onClose={handleDropdownClose} className="z-50"/>
          <div className="absolute left-0  bg-transparent  rounded-md shadow-md flex flex-col">
            {/* Andere Menüpunkte */}
          </div>
    </>
  );
};

export default SideBar;
