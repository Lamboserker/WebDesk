import React from "react";
import Sidebar from "./components/Sidebar";
import ProfileForm from "./components/ProfileForm";

const ProfileMenu = () => {
  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <Sidebar />
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <ProfileForm />
      </main>
    </div>
  );
};

export default ProfileMenu;
