import { DEFAULT_AVATAR, IMAGE_PROXY } from "../../shared/constants";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import ClickAwayListener from "../ClickAwayListener";
import { auth } from "../../shared/firebase";
import { signOut } from "firebase/auth";
import { useStore } from "../../store";
import UserInfo from "./UserInfo";

const Account: FC = () => {
  const currentUser = useStore((state) => state.currentUser);

  const [isPopupOpened, setIsPopupOpened] = useState(false);
  const [isUserInfoOpened, setIsUserInfoOpened] = useState(false);

  return (
    <>
      <div className="border-dark-lighten bg-secondary flex flex flex-col items-center justify-between border px-6 py-6">
        <Link to="/" className="flex items-center gap-1">
          <img className="h-8 w-8" src="/icon.svg" alt="" />
        </Link>

        <div className="flex items-center gap-3">
          <ClickAwayListener onClickAway={() => setIsPopupOpened(false)}>
            {(ref) => (
              <div ref={ref} className="relative z-10">
                <img
                  onClick={() => setIsPopupOpened((prev) => !prev)}
                  className=" h-10 w-10 cursor-pointer rounded-full object-cover"
                  src={
                    currentUser?.photoURL
                      ? IMAGE_PROXY(currentUser.photoURL)
                      : DEFAULT_AVATAR
                  }
                  alt=""
                />

                <div
                  className={`border-dark-lighten bg-dark absolute bottom-full left-full flex w-max origin-bottom-left flex-col items-stretch overflow-hidden rounded-lg border py-1 shadow-lg transition-all duration-200 ${
                    isPopupOpened
                      ? "visible scale-100 opacity-100"
                      : "invisible scale-0 opacity-0"
                  }`}
                >
                  <button
                    onClick={() => {
                      setIsUserInfoOpened(true);
                      setIsPopupOpened(false);
                    }}
                    className="hover:bg-dark-lighten flex items-center gap-1 px-3 py-1 transition duration-300"
                  >
                    <i className="bx bxs-user text-xl"></i>
                    <span className="whitespace-nowrap">Profile</span>
                  </button>
                  <button
                    onClick={() => signOut(auth)}
                    className="hover:bg-dark-lighten flex items-center gap-1 px-3 py-1 transition duration-300"
                  >
                    <i className="bx bx-log-out text-xl"></i>
                    <span className="whitespace-nowrap">Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </ClickAwayListener>
        </div>
      </div>
      <UserInfo isOpened={isUserInfoOpened} setIsOpened={setIsUserInfoOpened} />
    </>
  );
};

export default Account;
