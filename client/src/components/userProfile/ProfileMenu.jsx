import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import ProfileForm from "./components/ProfileForm";
import AccountSettings from "./components/AccountSettings";
import Notifications from "./components/Notifications";
import ProAccount from "./components/ProAccount";
import Switcher from "../../Switcher";
import { useSidebar } from "../../Context/SidebarContext";
const ProfileMenu = () => {
  const location = useLocation();
  const { selectedMenuItem } = useSidebar();
  let ComponentToRender;

  switch (location.pathname) {
    case "/profile-form":
      ComponentToRender = ProfileForm;
      break;
    case "/account-settings":
      ComponentToRender = AccountSettings;
      break;
    case "/notifications":
      ComponentToRender = Notifications;
      break;
    case "/pro-account":
      ComponentToRender = ProAccount;
      break;
    default:
      ComponentToRender = ProfileForm; // Standardkomponente, falls keine Übereinstimmung gefunden wird
  }

  return (
    <div className="bg-luckyPoint-200 dark:bg-luckyPoint-700 w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <a href="/" className="-m-1.5 ml-6 p-1.5 fixed left-0 ">
        <span className="sr-only">WebDesk</span>
        <img
          className="h-24 w-24"
          src="https://cdn.discordapp.com/attachments/1185665614086426674/1194230093527130162/WebDesk__2___1_-removebg-preview.png?ex=65af9872&is=659d2372&hm=b5514c628bb56612b2ad214dcb0efa6b97cb88f5f264d187f528d993b121eb1d&"
          alt=""
        />
      </a>
      <Sidebar />
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <ComponentToRender />
      </main>
    </div>
  );
};

export default ProfileMenu;
