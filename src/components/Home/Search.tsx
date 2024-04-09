import React, { FC, FormEvent, useState } from "react";
import { db } from "../../shared/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { ConversationInfo } from "../../shared/types";
import { Link, useParams } from "react-router-dom";
import { useStore } from "../../store";
import { useUsersInfo } from "../../hooks/useUsersInfo";
import { useLastMessage } from "../../hooks/useLastMessage";
import { DEFAULT_AVATAR, IMAGE_PROXY, UNKNOWN } from "../../shared/constants";
import Skeleton from "../Skeleton";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
interface SelectConversationProps {
  conversation: ConversationInfo;
  conversationId: string;
}
const Search: FC<SelectConversationProps> = ({
  conversation,
  conversationId,
}) => {
  const { data: users } = useUsersInfo(conversation.users);

  const currentUser = useStore((state) => state.currentUser);

  const filtered = users?.filter((user) => user.id !== currentUser?.uid);

  const { id } = useParams();

  const {
    data: lastMessage,
    loading: lastMessageLoading,
    error: lastMessageError,
  } = useLastMessage(conversationId);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [err, setErr] = useState("");
  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "==", username)
    )
  );
  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      setErr("User unavailable");
    } else {
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    }
  };
  const handleKey = (e: any) => {
    e.code === "Enter" && handleSearch();
  };
  return (
    <>
      <div className="flex flex-1 flex-col items-stretch gap-2 overflow-y-auto border-b-[2px] py-2">
        <div className="flex flex-1 items-center justify-center px-3 pb-3 focus:border-gray-300">
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            onKeyDown={handleKey}
            type="text"
            placeholder="Search..."
            className="border-lighten bg-lighten text-dark-lighten h-full w-full rounded-lg border p-2 outline-none transition duration-300 focus:border-gray-300"
          />
        </div>
        {err && <span style={{ color: "black" }}>{err}</span>}
        {user && (
          <div>
            <Link
              to={`/${conversationId}`}
              className={`hover:bg-lighten relative flex items-stretch gap-2 py-2 px-5 transition duration-300 ${
                conversationId === id ? "!bg-[#d9d9d9]" : ""
              }`}
            >
              <img
                className="h-14 w-14 flex-shrink-0 rounded-full object-cover"
                src={
                  filtered?.[0]?.data()?.photoURL
                    ? IMAGE_PROXY(filtered?.[0]?.data()?.photoURL)
                    : DEFAULT_AVATAR
                }
                alt=""
              />
              <div className="flex flex-grow flex-col items-start gap-1 py-1">
                <p className="text-dark max-w-[240px] flex-grow overflow-hidden text-ellipsis whitespace-nowrap">
                  {filtered?.[0].data()?.displayName
                    ? filtered?.[0].data()?.displayName
                    : UNKNOWN}
                </p>
                {lastMessageLoading ? (
                  <Skeleton className="w-2/3 flex-grow" />
                ) : (
                  <p className="max-w-[240px] flex-grow overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-400">
                    {lastMessage?.message}
                  </p>
                )}
              </div>
              {!lastMessageLoading && (
                <>
                  {lastMessage?.lastMessageId !== null &&
                    lastMessage?.lastMessageId !==
                      conversation.seen[currentUser?.uid as string] && (
                      <div className="bg-primary absolute top-1/2 right-4 h-[10px] w-[10px] -translate-y-1/2 rounded-full"></div>
                    )}
                </>
              )}
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
