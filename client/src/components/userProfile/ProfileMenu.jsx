import React from "react";
import Sidebar from "./components/Sidebar";
import ProfileForm from "./components/ProfileForm";
import Switcher from "../../Switcher";

const ProfileMenu = () => {
  return (
    <div className="bg-luckyPoint-200 dark:bg-luckyPoint-700 w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <div className="flex end">
        <Switcher />
      </div>
      <Sidebar />
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <ProfileForm />
      </main>
    </div>
  );
};

export default ProfileMenu;
