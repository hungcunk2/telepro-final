import { FC, useEffect, useState } from "react";
import { CallEnd, CallMade, VideoCall } from "@material-ui/icons";
import ChatHeader from "../components/Chat/ChatHeader";
import ChatView from "../components/Chat/ChatView";
import { ConversationInfo, MessageInfo } from "../shared/types";
import InputSection from "../components/Input/InputSection";
import SideBar from "../components/Home/SideBar";
import Account from "../components/Home/Account";
import EditProfileModal from "./EditProfileModal";


import { db } from "../shared/firebase";
import { doc, setDoc, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useDocumentQuery } from "../hooks/useDocumentQuery";
import { useParams } from "react-router-dom";
import { useStore } from "../store";

const Chat: FC = () => {
  const { id } = useParams();
  const { data, loading, error } = useDocumentQuery(
    `conversation-${id}`,
    doc(db, "conversations", id as string)
  );
  const conversation = data?.data() as ConversationInfo;
  const currentUser = useStore((state) => state.currentUser);
  const [inputSectionOffset, setInputSectionOffset] = useState(0);
  const [replyInfo, setReplyInfo] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<MessageInfo | null>(null);
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false); // State để quản lý việc hiển thị EditProfileModal

  useEffect(() => {
    if (conversation?.theme)
      document.body.style.setProperty("--primary-color", conversation.theme);
  }, [conversation?.theme || ""]);

  useEffect(() => {
    const messageCollectionRef = collection(db, "messages");
    const messageQuery = query(
      messageCollectionRef,
      orderBy("timestamp"),
      limit(50) // Lấy 50 tin nhắn gần nhất
    );

    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      const updatedMessages: MessageInfo[] = [];
      snapshot.forEach((doc) => {
        updatedMessages.push({ id: doc.id, ...doc.data() } as MessageInfo);
      });
      setMessages(updatedMessages);
    });

    return () => unsubscribe();
  }, []);

  const handleRecallMessage = () => {
    // Logic to recall message
  };

  const handleMakeCall = () => {
    // Bắt đầu cuộc gọi
    setIsCalling(true);
    // Khởi tạo một PeerConnection
    const pc = new RTCPeerConnection();
    setPeerConnection(pc);

    // Thực hiện các bước cần thiết để thiết lập cuộc gọi sử dụng WebRTC
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }) // Lấy local stream audio và video
      .then((stream) => {
        // Thêm local stream vào PeerConnection
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        // Thêm event listener để xử lý sự kiện khi có remote stream được thêm vào
        pc.ontrack = (event) => {
          // event.streams chứa remote stream
          const remoteStream = event.streams[0];
          // Sử dụng remote stream để hiển thị video từ đối tác giao tiếp
          // Code hiển thị remote stream ở đây...
        };

        // Tạo offer SDP
        return pc.createOffer();
      })
      .then((offer) => {
        // Đặt local description là offer SDP
        return pc.setLocalDescription(offer);
      })
      .then(() => {
        // Gửi offer SDP cho đối tác giao tiếp
        // Code gửi offer SDP đi ở đây...
      })
      .catch((error) => {
        console.error('Error making call:', error);
        setIsCalling(false);
      });
  };

  const handleEndCall = () => {
    // Kết thúc cuộc gọi
    setIsCalling(false);
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
  };

  const handleForwardMessage = (message: MessageInfo) => {
    setSelectedMessage(message);
    setForwardModalOpen(true);
  };

  const handleCloseForwardModal = () => {
    setSelectedMessage(null);
    setForwardModalOpen(false);
  };

  const handleConfirmForwardMessage = (selectedUserId: string) => {
    // Gửi thông tin tin nhắn cũ và người nhận đến máy chủ để chuyển tiếp tin nhắn
    // Logic xử lý chuyển tiếp tin nhắn ở đây...

    // Sau khi gửi tin nhắn, đóng modal và đặt lại state
    handleCloseForwardModal();
  };

  return (
    <div className="flex">
      <Account />
      <SideBar />
      <div className="bg-lighten flex h-screen flex-grow flex-col items-stretch">
        {loading ? (
          <>
            <div className="border-lighten h-20 border-b"></div>
            <div className="flex-grow"></div>
            <InputSection disabled />
          </>
        ) : !conversation ||
          error ||
          !conversation.users.includes(currentUser?.uid as string) ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 rounded">
            <img
              className="h-32 w-32 rounded object-cover"
              src="/error.svg"
              alt=""
            />
            <p className="text-dark-lighten text-center text-lg">
              Conversation does not exist
            </p>
          </div>
        ) : (
          <>
            <ChatHeader conversation={conversation} />
            <ChatView
              replyInfo={replyInfo}
              setReplyInfo={setReplyInfo}
              inputSectionOffset={inputSectionOffset}
              conversation={conversation}
              messages={messages} // Truyền danh sách tin nhắn vào component ChatView
              onForwardMessage={handleForwardMessage}
            />
            <InputSection
              setInputSectionOffset={setInputSectionOffset}
              replyInfo={replyInfo}
              setReplyInfo={setReplyInfo}
              disabled={false}
            />
            <div className="flex justify-center gap-3 p-4">
              <button onClick={handleRecallMessage}>
                Recall Message <CallMade />
              </button>
              <button onClick={handleMakeCall} disabled={isCalling || isInCall}>
                Make Call <VideoCall />
              </button>
              <button onClick={handleEndCall} disabled={!isCalling && !isInCall}>
                End Call <CallEnd />
              </button>
              <button onClick={() => setIsEditingProfile(true)}>Edit Profile</button> {/* Button để mở EditProfileModal */}
            </div>
          </>
        )}
      </div>
      {forwardModalOpen && (
        <div className="fixed top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-bold mb-4">Forward Message</h2>
            <p>Forward the selected message to:</p>
            {/* Tạo giao diện cho việc chọn người nhận */}
            <button onClick={handleCloseForwardModal}>Cancel</button>
            <button onClick={() => handleConfirmForwardMessage("userId")}>Confirm</button>
          </div>
        </div>
      )}
      <EditProfileModal isOpen={isEditingProfile} onClose={() => setIsEditingProfile(false)} /> {/* Hiển thị EditProfileModal nếu isEditingProfile là true */}
      <button className="edit-profile-button" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>

    </div>
  );
};

export default Chat;
