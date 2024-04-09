import { DEFAULT_AVATAR, IMAGE_PROXY } from "../../shared/constants";
import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { ConversationInfo } from "../../shared/types";
import CreateConversation from "./CreateConversation";
import SelectConversation from "./SelectConversation";
import Spin from "react-cssfx-loading/src/Spin";
import { db } from "../../shared/firebase";
import { useCollectionQuery } from "../../hooks/useCollectionQuery";
import { useStore } from "../../store";
import Search from "./Search";
import { useCollectionQuery1 } from "../../hooks/useCollectionQuery1";

const SideBar: FC = () => {
  const currentUser = useStore((state) => state.currentUser);
  const [createConversationOpened, setCreateConversationOpened] =
    useState(false);
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [err, setErr] = useState("");
  const { data, error, loading } = useCollectionQuery(
    "conversations",
    query(
      collection(db, "conversations"),
      orderBy("updatedAt", "desc"),
      where("users", "array-contains", currentUser?.uid)
    )
  );
  const { data1, error1, loading1 } = useCollectionQuery1(
    "conversations",
    query(
      collection(db, "conversations"),
      where("users", "==", currentUser?.uid)
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

  const location = useLocation();

  return (
    <>
      <div
        className={`bg-light border-lighten h-screen flex-shrink-0 overflow-y-auto overflow-x-hidden border-r ${
          location.pathname !== "/"
            ? "hidden w-[350px] md:!block"
            : "w-full md:!w-[350px]"
        }`}
      >
        <div className="h-15 flex items-center justify-between px-6 py-3 pt-5">
          <Link to="/" className="flex items-center gap-1">
            <h1 className="text-dark text-3xl md:font-bold">Chats</h1>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateConversationOpened(true)}
              className="bg-secondary h-10 w-10 rounded-full"
            >
              <i className="bx bxs-edit text-xl" color="black"></i>
            </button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-3 pb-3 focus:border-gray-300">
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
        </div>

        {loading ? (
          <div className="my-6 flex justify-center">
            <Spin />
          </div>
        ) : error ? (
          <div className="my-6 flex justify-center">
            <p className="text-dark-lighten text-center">
              Something went wrong
            </p>
          </div>
        ) : data?.empty ? (
          <div className="my-6 flex flex-col items-center justify-center">
            <p className="text-dark-lighten text-center">
              No conversation found
            </p>
            <button
              onClick={() => setCreateConversationOpened(true)}
              className="text-primary text-center"
            >
              Create one
            </button>
          </div>
        ) : user ? (
          <div>
            {data1?.docs.map((item) => (
              <Search
                key={item.id}
                conversation={item.data() as ConversationInfo}
                conversationId={item.id}
              />
            ))}
          </div>
        ) : (
          <div>
            {data?.docs.map((item) => (
              <SelectConversation
                key={item.id}
                conversation={item.data() as ConversationInfo}
                conversationId={item.id}
              />
            ))}
          </div>
        )}
      </div>

      {createConversationOpened && (
        <CreateConversation setIsOpened={setCreateConversationOpened} />
      )}
    </>
  );
};

export default SideBar;
