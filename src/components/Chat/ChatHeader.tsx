import { FC, useState } from "react";

import { ConversationInfo } from "../../shared/types";
import ConversationSettings from "./ConversationSettings";
import { DEFAULT_AVATAR, IMAGE_PROXY, UNKNOWN } from "../../shared/constants";
import { Link } from "react-router-dom";
import Skeleton from "../Skeleton";
import ViewGroup from "../Group/ViewGroup";
import ViewMedia from "../Media/ViewMedia";
import { useStore } from "../../store";
import { useUsersInfo } from "../../hooks/useUsersInfo";
import UserInfo from "../Home/UserInfo";

interface ChatHeaderProps {
  conversation: ConversationInfo;
}

const ChatHeader: FC<ChatHeaderProps> = ({ conversation }) => {
  const { data: users, loading } = useUsersInfo(conversation.users);
  const currentUser = useStore((state) => state.currentUser);

  const filtered = users?.filter((user) => user.id !== currentUser?.uid);

  const [isConversationSettingsOpened, setIsConversationSettingsOpened] =
    useState(false);
  const [isGroupMembersOpened, setIsGroupMembersOpened] = useState(false);
  const [isViewMediaOpened, setIsViewMediaOpened] = useState(false);
  const [isUserInfoOpened, setIsUserInfoOpened] = useState(false);

  return (
    <>
      <div className="bg-light border-less-lighten flex h-20 items-center justify-between border-b px-5">
        <div className="flex flex-grow items-center gap-3">
          <Link to="/" className="md:hidden">
            <i className="bx bxs-chevron-left text-primary text-3xl"></i>
          </Link>
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            <>
              {conversation.users.length === 2 ? (
                <button
                  onClick={() => {
                    setIsUserInfoOpened(true);
                  }}
                  className="hover:bg-lighten flex items-center gap-1 rounded-full px-2 py-2 transition duration-300"
                >
                  <img
                    className="h-10 w-10 rounded-full"
                    src={
                      filtered?.[0]?.data()?.photoURL
                        ? IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)
                        : DEFAULT_AVATAR
                    }
                    alt=""
                  />
                </button>
              ) : (
                <>
                  {conversation?.group?.groupImage ? (
                    <img
                      className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                      src={conversation.group.groupImage}
                      alt=""
                    />
                  ) : (
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <img
                        className="absolute top-0 right-0 h-7 w-7 flex-shrink-0 rounded-full object-cover"
                        src={
                          filtered?.[0]?.data()?.photoURL
                            ? IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)
                            : DEFAULT_AVATAR
                        }
                        alt=""
                      />
                      <img
                        className={` absolute bottom-0 left-0 z-[1] h-7 w-7 flex-shrink-0 rounded-full  object-cover transition duration-300`}
                        src={
                          filtered?.[1]?.data()?.photoURL
                            ? IMAGE_PROXY(filtered?.[1]?.data()?.photoURL)
                            : DEFAULT_AVATAR
                        }
                        alt=""
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {loading ? (
            <Skeleton className="h-6 w-1/4" />
          ) : (
            <p className="text-dark">
              {conversation.users.length > 2 && conversation?.group?.groupName
                ? conversation.group.groupName
                : filtered
                    ?.map((user) =>
                      user.data()?.displayName
                        ? user.data()?.displayName
                        : UNKNOWN
                    )
                    .slice(0, 3)
                    .join(", ")}
            </p>
          )}
        </div>

        {!loading && (
          <div className="flex gap-4">
            <button onClick={() => setIsConversationSettingsOpened(true)}>
              <i className="bx bxs-phone text-primary hover:bg-lighten flex items-center gap-1 rounded-full px-2 py-1 text-2xl transition duration-300"></i>
            </button>
            <button onClick={() => setIsConversationSettingsOpened(true)}>
              <i className="bx bxs-video text-primary hover:bg-lighten flex items-center gap-1 rounded-full px-2 py-1 text-2xl transition duration-300"></i>
            </button>
            {conversation.users.length > 2 && (
              <button onClick={() => setIsGroupMembersOpened(true)}>
                <i className="bx bxs-group text-primary hover:bg-lighten flex items-center gap-1 rounded-full px-2 py-1 text-2xl transition duration-300"></i>
              </button>
            )}
            <button onClick={() => setIsConversationSettingsOpened(true)}>
              <i className="bx bxs-info-circle text-primary hover:bg-lighten flex items-center gap-1 rounded-full px-2 py-1 text-2xl transition duration-300"></i>
            </button>
          </div>
        )}
      </div>

      {isConversationSettingsOpened && (
        <ConversationSettings
          setIsOpened={setIsConversationSettingsOpened}
          conversation={conversation}
          setMediaViewOpened={setIsViewMediaOpened}
        />
      )}

      {isGroupMembersOpened && (
        <ViewGroup
          setIsOpened={setIsGroupMembersOpened}
          conversation={conversation}
        />
      )}
      {isViewMediaOpened && <ViewMedia setIsOpened={setIsViewMediaOpened} />}
      <UserInfo isOpened={isUserInfoOpened} setIsOpened={setIsUserInfoOpened} />
    </>
  );
};

export default ChatHeader;
