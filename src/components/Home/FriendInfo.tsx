import { FC } from "react";
import { IMAGE_PROXY } from "../../shared/constants";
import { useStore } from "../../store";

interface UserInfoProps {
  isOpened: boolean;
  setIsOpened: (value: boolean) => void;
}

const UserInfo: FC<UserInfoProps> = ({ isOpened, setIsOpened }) => {
  const currentUser = useStore((state) => state.currentUser);

  return (
    <div
      onClick={() => setIsOpened(false)}
      className={`fixed top-0 left-0 z-20 flex h-full w-full items-center justify-center bg-[#00000080] transition-all duration-300 ${
        isOpened ? "visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-light-blue mx-2 w-full max-w-[550px] rounded-lg"
      >
        <div className="border-lighten flex items-center justify-between border-b py-3 px-3">
          <div className="flex-1"></div>
          <div className="flex flex-1 items-center justify-center">
            <h1 className="text-dark whitespace-nowrap text-center text-2xl">
              Profile
            </h1>
          </div>
          <div className="flex flex-1 items-center justify-end">
            <button
              onClick={() => setIsOpened(false)}
              className="bg-light-blue flex h-8 w-8 items-center justify-center rounded-full"
            >
              <i className="bx bx-x text-dark text-2xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4">
            <img
              className="h-30 w-30 rounded-full object-cover"
              src={IMAGE_PROXY(currentUser?.photoURL as string)}
              alt=""
            />
            <div className="">
              <h1 className="text-dark-lighten text-xl">
                {currentUser?.displayName}
              </h1>
              <p className="text-dark-lighten">ID: {currentUser?.uid}</p>
              <p className="text-dark-lighten">
                Email: {currentUser?.email || "None"}
              </p>
              <p className="text-dark-lighten">
                Phone Number: {currentUser?.phoneNumber || "None"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-gray-500">
            Change your google / facebook avatar or username to update it here
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
