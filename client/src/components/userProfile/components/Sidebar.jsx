import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../../Context/SidebarContext";

const Sidebar = () => {
  const location = useLocation();
  const { updateSelectedMenuItem } = useSidebar();
  const isActive = (path) => location.pathname === path;

  const getLinkClassName = (path) => {
    return isActive(path)
      ? "flex items-center px-3 py-2.5 text-xl font-extrabold text-transparent bg-clip-text bg-custom-gradient border rounded-full"
      : "flex items-center px-3 py-2.5 font-semibold hover:text-luckyPoint-900 hover:border hover:rounded-full";
  };

  const handleMenuItemClick = (menuItem) => {
    updateSelectedMenuItem(menuItem);
  };

  return (
    <aside className="bg-luckyPoint-200 dark:bg-luckyPoint-700 hidden py-4 md:w-1/3 lg:w-1/4 md:block">
      <div className="sticky flex flex-col gap-2 p-4 text-sm border-r border-luckyPoint-100 top-12">
        <h2 className="pl-3 mb-4 text-xl font-extrabold text-gray-900 dark:text-white  md:text-3xl lg:text-4xl">
          Settings
        </h2>

        <Link
          to="/profile-form"
          onClick={() => handleMenuItemClick("profile-form")}
          className={getLinkClassName("/profile-form")}
        >
          Public Profile
        </Link>
        <Link
          to="/account-settings"
          onClick={() => handleMenuItemClick("account-settings")}
          className={getLinkClassName("/account-settings")}
        >
          Account Settings
        </Link>
        <Link
          to="/notifications"
          onClick={() => handleMenuItemClick("notifications")}
          className={getLinkClassName("/notifications")}
        >
          Notifications
        </Link>
        <Link
          to="/pro-account"
          onClick={() => handleMenuItemClick("pro-account")}
          className={getLinkClassName("/pro-account")}
        >
          PRO Account
        </Link>
      </div>
      
    </aside>
  );
};

export default Sidebar;
