import { FC, useState } from "react";
import SideBar from "../components/Home/SideBar";
import Account from "../components/Home/Account";
import EditProfileModal from "./EditProfileModal";


const Home: FC = () => {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleEditProfileOpen = () => {
    setIsEditProfileOpen(true);
  };

  const handleEditProfileClose = () => {
    setIsEditProfileOpen(false);
  };

  return (
    <div className="flex">
      <Account />
      <SideBar />

      <div className="bg-lighten hidden flex-grow flex-col items-center justify-center gap-3 md:!flex">
        <h1 className="text-dark-lighten border-dark rounded-full p-2 text-center">
          Select a conversation to start chatting
        </h1>
        <button onClick={handleEditProfileOpen}>Edit Profile</button>
        {/* Render EditProfileModal */}
        {isEditProfileOpen && (
          <EditProfileModal onClose={handleEditProfileClose} />
        )}
      </div>
    </div>
  );
};

export default Home;
