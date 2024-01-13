import { Fragment, useRef, useState, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChatBubbleBottomCenterIcon,
  SpeakerWaveIcon,
  UserGroupIcon,
  MegaphoneIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { WorkspaceContext } from "../../Context/WorkspaceContext";
export default function ChannelPopup() {
  const [open, setOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [newChannelName, setNewChannelName] = useState("");
  const [channelType, setChannelType] = useState(null);
  const cancelButtonRef = useRef(null);
  const { selectedWorkspace } = useContext(WorkspaceContext);
  const options = [
    {
      name: "Text",
      type: "textChannel",
      icon: ChatBubbleBottomCenterIcon,
      description:
        "create a only-text channel. You can just write messages and start the whiteboard.",
    }, // Replace 'text-icon.svg' with the actual icon file paths
    {
      name: "Voice and Video",
      type: "voiceChannel",
      icon: SpeakerWaveIcon,
      description:
        "create a voice channel. You can talk with your friends and start the whiteboard.",
    },
    {
      name: "Forum",
      type: "forum",
      icon: UserGroupIcon,
      description:
        "create a forum channel. You can discuss with your friends and start the whiteboard.",
    },
    {
      name: "Announcement",
      type: "announcement",
      icon: MegaphoneIcon,
      description:
        "create a announcement channel. You can announce something to your friends and start the whiteboard.",
    },
    {
      name: "Stage",
      type: "stage",
      icon: ComputerDesktopIcon,
      description:
        "create a stage channel. You can create a stage and start the whiteboard.",
    },
  ];

  

  const handleOptionClick = (option) => {
    setSelectedOption(option.name);
    setChannelType(option.type); // Hier wird jetzt `option.name` als `channelType` gesetzt
  };

  const handleInputChange = (e) => {
    setNewChannelName(e.target.value);
  };

  const saveNewChannel = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const workspaceId = selectedWorkspace;
      console.log("workspaceId:", workspaceId); // Zur Überprüfung hinzugefügt
      if (!workspaceId || !newChannelName) {
        console.error("No workspace or channel name provided");
        return;
      }

      const response = await axios.post(
        `http://localhost:9000/api/workspaces/${workspaceId}/create-channel`,
        {
          name: newChannelName,
          type: channelType,
          workspaceId: workspaceId,
          messages: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fügen Sie den neu erstellten Channel zum State hinzu
      // setChannels((prevChannels) => [...prevChannels, response.data]);
      setOpen(false);
      // setIsCreatingChannel(false); // Falls Sie diesen State verwenden
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 shadow-lg"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-luckyPoint-200 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-luckyPoint-950 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg w-full border border-gray-300">
                <div className="px-6 py-4 bg-luckyPoint-900 text-luckyPoint-200 ">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 uppercase"
                  >
                    create a channel
                  </Dialog.Title>
                </div>
                <div className="flex flex-col gap-5 px-6 py-4 bg-luckyPoint-950 text-luckyPoint-200">
                  {options.map((option) => (
                    <button
                      key={option.name}
                      className={`flex items-center px-4 py-2 mt-2 text-sm font-medium rounded focus:outline-none hover:bg-luckyPoint-600 shadow-2xl  transition duration-300 ease-in-out  dark:hover:bg-gray-700    ${
                        selectedOption === option.name
                          ? "bg-luckyPoint-900"
                          : "bg-luckyPoint-700"
                      }`}
                      onClick={() => handleOptionClick(option)} // Rufen Sie die Funktion mit dem ganzen `option`-Objekt auf
                    >
                      <option.icon
                        className="h-6 w-6 mr-2"
                        aria-hidden="true"
                      />
                      <div className="flex flex-col flex-grow">
                        <h3 className="font-bold">{option.name}</h3>
                        <span className="text-luckyPoint-400">
                          {option.description}
                        </span>
                      </div>
                      {selectedOption === option.name && (
                        <div className="flex-shrink-0 w-4 h-4 ml-2 rounded-full bg-luckyPoint-500 border-2 border-luckyPoint-300" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="bg-luckyPoint-950 px-6 pt-6 pb-4 text-luckyPoint-200">
                  <div className=" mb-4">
                    <div className="w-full">
                      <div className="relative w-full min-w-[200px] h-10">
                        <input
                          className=" peer w-full h-full bg-luckyPoint-900 text-luckyPoint-200 font-bold font-sans  outline outline-0 focus:outline-0 disabled:bg-luckyPoint-200 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-white placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-luckyPoint-200 focus:border-luckyPoint-200"
                          placeholder=""
                          type="text"
                          value={newChannelName}
                          onChange={handleInputChange}
                        />
                        <label className="  flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-luckyPoint-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-luckyPoint-500 peer-focus:text-luckyPoint-200 before:border-luckyPoint-200 peer-focus:before:!border-gray-200 after:border-luckyPoint-200 peer-focus:after:!border-luckyPoint-200">
                          channel name
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-luckyPoint-900 px-4 py-3 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-luckyPoint-200 px-4 py-2 text-sm font-medium text-luckyPoint-700 shadow-sm hover:bg-luckyPoint-100 focus:outline-none focus:ring-2 focus:ring-luckyPoint-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={saveNewChannel}
                  >
                    create channel
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-luckyPoint-300 bg-luckyPoint-600 px-4 py-2 text-sm font-medium text-luckyPoint-200 shadow-sm hover:bg-luckyPoint-700 focus:outline-none focus:ring-2 focus:ring-luckyPoint-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
