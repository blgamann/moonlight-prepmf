"use client";

import Image from "next/image";
import data from "@/data.json"; // Import data from data.json
import { useState, useEffect, useRef } from "react"; // Import useState, useEffect, and useRef

// Define types for clarity (optional but good practice)
type Profile = {
  id: string;
  name: string;
  imageUrl: string;
  bio: string;
};

type SoulLink = {
  profile: Profile;
  status: "waiting" | "launchable";
  daysElapsed: number;
};

// Define type for chat tabs
type ChatTab = "메시지" | "함께 답한 질문" | "함께 아는 친구들";

// Define type for a single message
type Message = {
  id: number; // Simple ID for key prop
  text: string;
  sender: "user" | "profile";
};

// Define type for messages state (mapping profileId to message array)
type MessagesState = {
  [profileId: string]: Message[];
};

// Re-introduce RightPanelMode type
type RightPanelMode = "soulLink" | "chat";

export default function SoulLinkPage() {
  const profiles = data.profiles;

  // State for right panel view mode
  const [rightPanelMode, setRightPanelMode] =
    useState<RightPanelMode>("soulLink");
  // State for Soul Link active tab
  const [activeSoulLinkTab, setActiveSoulLinkTab] = useState<
    "waiting" | "launchable"
  >("waiting");
  // State for Chat active tab
  const [activeChatTab, setActiveChatTab] = useState<ChatTab>("메시지");
  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Profile selected for CHAT
  const [selectedChatProfile, setSelectedChatProfile] =
    useState<Profile | null>(null);
  // Profile selected for MODAL (can be different from chat)
  const [modalProfile, setModalProfile] = useState<Profile | null>(null);

  // State to store messages for all conversations
  const [messages, setMessages] = useState<MessagesState>({});
  // State for the current message input
  const [currentMessage, setCurrentMessage] = useState("");
  // Ref for scrolling chat to bottom
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Placeholder Data ---
  // Assume profile-1 and profile-2 are waiting
  const waitingLinks: SoulLink[] = [
    { profile: profiles[0], status: "waiting", daysElapsed: 13 },
    { profile: profiles[1], status: "waiting", daysElapsed: 26 },
  ];
  // Assume profile-2 and profile-3 are launchable (index adjusted)
  const launchableLinks: SoulLink[] = [
    { profile: profiles[2], status: "launchable", daysElapsed: 8 },
    { profile: profiles[3], status: "launchable", daysElapsed: 16 },
  ];
  // Assume user's profile (for modal)
  const userProfile = profiles[4]; // Example: Using profile-5 as the user
  // ----------------------

  // Function to scroll chat to the bottom
  useEffect(() => {
    if (rightPanelMode === "chat") {
      // Only scroll when in chat mode
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedChatProfile, activeChatTab, rightPanelMode]);

  const openModal = (profile: Profile) => {
    setModalProfile(profile); // Use modalProfile for modal context
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProfile(null); // Clear modal profile on close
  };

  // Function to handle selecting a profile from the left list
  const handleProfileSelect = (profile: Profile) => {
    setSelectedChatProfile(profile); // Set selected profile to switch view to chat
    setRightPanelMode("chat"); // Switch right panel to chat mode
    setActiveChatTab("메시지");
    if (!messages[profile.id]) {
      setMessages((prev) => ({ ...prev, [profile.id]: [] }));
    }
  };

  // Function to go back from chat view to the list view
  const handleGoBackToList = () => {
    setSelectedChatProfile(null);
  };

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !selectedChatProfile) return;

    const newMessage: Message = {
      id: Date.now(), // Simple unique ID
      text: currentMessage.trim(),
      sender: "user",
    };

    const profileId = selectedChatProfile.id;

    // Update messages state
    setMessages((prev) => ({
      ...prev,
      [profileId]: [...(prev[profileId] || []), newMessage],
    }));

    // Clear input
    setCurrentMessage("");

    // Simulate reply after a short delay
    setTimeout(() => {
      const replyMessage: Message = {
        id: Date.now() + 1,
        text: `(자동 응답) ${selectedChatProfile.name}입니다. 메시지 확인 후 답변드릴게요.`, // Placeholder reply
        sender: "profile",
      };
      setMessages((prev) => ({
        ...prev,
        [profileId]: [...(prev[profileId] || []), replyMessage],
      }));
    }, 1000);
  };

  // --- Conditional Rendering based on selectedProfile ---

  if (selectedChatProfile) {
    // --- Render ONLY Chat View ---
    return (
      <div className="flex flex-col h-screen bg-white">
        {/* Header with Back Button and Profile Info */}
        <div className="p-3 border-b border-gray-200 flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={handleGoBackToList}
            className="text-gray-500 hover:text-cyan-600 p-1 rounded-full hover:bg-gray-100"
          >
            {/* Back Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <Image
            src={selectedChatProfile.imageUrl}
            alt={selectedChatProfile.name}
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="font-semibold text-sm">
            {selectedChatProfile.name}
          </span>
        </div>

        {/* Chat Tabs */}
        <div className="flex border-b border-gray-200 px-3 flex-shrink-0">
          {(["메시지", "함께 답한 질문", "함께 아는 친구들"] as ChatTab[]).map(
            (tab) => (
              <button
                key={tab}
                className={`py-3 px-5 text-sm font-medium ${
                  activeChatTab === tab
                    ? "text-cyan-500 border-b-2 border-cyan-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setActiveChatTab(tab)}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Chat Content Area */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {activeChatTab === "메시지" && selectedChatProfile && (
            <>
              {(messages[selectedChatProfile.id] ?? []).map((msg: Message) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-cyan-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
          {activeChatTab === "함께 답한 질문" && (
            <div className="text-center text-gray-500 pt-10">
              {selectedChatProfile.name}님과 함께 답한 질문 (Placeholder)
            </div>
          )}
          {activeChatTab === "함께 아는 친구들" && (
            <div className="text-center text-gray-500 pt-10">
              {selectedChatProfile.name}님과 함께 아는 친구들 (Placeholder)
            </div>
          )}
        </div>

        {/* Message Input */}
        {activeChatTab === "메시지" && (
          <div className="p-4 border-t border-gray-200 flex-shrink-0 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="메시지 입력..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-grow border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="bg-cyan-500 text-white rounded-full p-2 disabled:opacity-50 hover:bg-cyan-600 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    // --- Render Initial Combined View (List + SoulLink) ---
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Left Panel: Messages List */}
        <div className="w-[370px] h-full bg-white p-4 space-y-1 overflow-y-auto border-r border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold mb-3 px-2">메시지</h2>
          {profiles.map((profile) => {
            // Temporarily remove highlighting logic to avoid persistent TS error
            // const isSelected = selectedChatProfile && selectedChatProfile.id === profile.id;

            return (
              <div
                key={profile.id}
                // Remove conditional class application
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                // className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer ${
                //   isSelected ? 'bg-gray-100' : ''
                // }`}
                onClick={() => handleProfileSelect(profile)}
              >
                <Image
                  src={profile.imageUrl}
                  alt={`Profile of ${profile.name}`}
                  width={50}
                  height={50}
                  className="rounded-full flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{profile.name}</span>
                  <span className="text-xs text-gray-500">
                    {messages[profile.id]?.[
                      messages[profile.id].length - 1
                    ]?.text.substring(0, 25) || profile.bio.substring(0, 25)}
                    ... • 1h
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel: Soul Links View */}
        <div className="w-full h-full flex flex-col bg-white">
          {/* SoulLink Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`py-3 px-6 text-sm font-medium ${
                activeSoulLinkTab === "waiting"
                  ? "text-cyan-500 border-b-2 border-cyan-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveSoulLinkTab("waiting")}
            >
              대기 중
            </button>
            <button
              className={`py-3 px-6 text-sm font-medium ${
                activeSoulLinkTab === "launchable"
                  ? "text-cyan-500 border-b-2 border-cyan-500"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveSoulLinkTab("launchable")}
            >
              띄우기
            </button>
          </div>
          {/* SoulLink Tab Content */}
          <div className="flex-grow p-6 overflow-y-auto">
            {activeSoulLinkTab === "waiting" && (
              <div className="space-y-4">
                {waitingLinks.map((link) => (
                  <div
                    key={link.profile.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={link.profile.imageUrl}
                        alt={link.profile.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {link.profile.name}님과의 소울링크
                        </p>
                        <p className="text-xs text-gray-500">
                          {link.daysElapsed}일 경과
                        </p>
                      </div>
                    </div>
                    <button className="text-sm text-red-500 border border-red-500 rounded-full px-4 py-1 hover:bg-red-50">
                      내리기
                    </button>
                  </div>
                ))}
              </div>
            )}
            {activeSoulLinkTab === "launchable" && (
              <div className="space-y-4">
                {launchableLinks.map((link) => (
                  <div
                    key={link.profile.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <Image
                        src={link.profile.imageUrl}
                        alt={link.profile.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {link.profile.name}님과의 소울링크
                        </p>
                        <p className="text-xs text-gray-500">
                          {link.daysElapsed}일 경과
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(link.profile)}
                      className="text-sm text-white bg-cyan-500 rounded-full px-4 py-1 hover:bg-cyan-600"
                    >
                      소울링크 띄우기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal (Uses modalProfile now) */}
        {isModalOpen && modalProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-sm w-full relative shadow-lg">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={modalProfile.imageUrl}
                  alt={modalProfile.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-base font-medium">
                  {modalProfile.name}님과의{" "}
                  <span className="text-cyan-500 font-semibold">소울링크</span>
                  를 띄워볼까요?
                </p>
              </div>
              {/* Modal buttons and content ... */}
              <div className="space-y-3 mb-5">
                <button className="w-full bg-cyan-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-600">
                  네
                </button>
                <button
                  onClick={closeModal}
                  className="w-full border border-cyan-500 text-cyan-500 py-2.5 rounded-lg text-sm font-medium hover:bg-cyan-50"
                >
                  아직이요, 좀 더 시간을 가져볼게요
                </button>
              </div>
              <p className="text-xs text-gray-500 text-center mb-4">
                소울링크를 띄우기 위해서는{" "}
                <span className="font-semibold text-purple-600">500원</span>이
                소요됩니다.
              </p>
              <p className="text-xs text-gray-500 text-center mb-4">
                두 분 모두 소울링크를 띄운 경우에만 소울링크가 형성됩니다.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Image
                  src={userProfile.imageUrl}
                  alt={userProfile.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-cyan-500 -ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <Image
                  src={modalProfile.imageUrl}
                  alt={modalProfile.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}
