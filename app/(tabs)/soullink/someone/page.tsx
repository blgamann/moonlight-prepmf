"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image"; // Import Image component
import data from "@/data.json"; // Import the data

// Mock message structure
interface Message {
  id: number;
  text: string;
  sender: "user" | "other";
  timestamp: string;
}

type Tab = "chat" | "answers" | "links";

export default function SomeonePage() {
  const [messages, setMessages] = useState<Message[]>([
    // Example messages - replace with actual data fetching
    { id: 1, text: "안녕하세요!", sender: "other", timestamp: "10:00 AM" },
    {
      id: 2,
      text: "네, 안녕하세요! 김민준입니다.",
      sender: "user",
      timestamp: "10:01 AM",
    },
    {
      id: 3,
      text: "반갑습니다. 무엇을 도와드릴까요?",
      sender: "other",
      timestamp: "10:02 AM",
    },
    // Add more mock messages if needed for scrolling demonstration
    {
      id: 4,
      text: "프로젝트 관련해서 궁금한 점이 있어서요.",
      sender: "user",
      timestamp: "10:03 AM",
    },
    {
      id: 5,
      text: "네, 어떤 점이 궁금하신가요?",
      sender: "other",
      timestamp: "10:04 AM",
    },
    {
      id: 6,
      text: "어제 공유주신 디자인 시안 검토했습니다.",
      sender: "user",
      timestamp: "10:05 AM",
    },
    {
      id: 7,
      text: "피드백 드릴 내용이 좀 있습니다.",
      sender: "user",
      timestamp: "10:05 AM",
    },
    {
      id: 8,
      text: "네 확인했습니다. 편하게 말씀해주세요.",
      sender: "other",
      timestamp: "10:06 AM",
    },
    {
      id: 9,
      text: "전반적인 레이아웃은 좋은데, 버튼 색상이 조금 더 밝았으면 좋겠습니다.",
      sender: "user",
      timestamp: "10:07 AM",
    },
    {
      id: 10,
      text: "알겠습니다. 색상 코드 제안해주실 수 있을까요?",
      sender: "other",
      timestamp: "10:08 AM",
    },
    {
      id: 11,
      text: "#5C6BC0 정도는 어떨까요?",
      sender: "user",
      timestamp: "10:09 AM",
    },
    {
      id: 12,
      text: "좋은 제안 감사합니다. 반영해서 수정해보겠습니다.",
      sender: "other",
      timestamp: "10:10 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("chat"); // State for active tab
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Find Kim Minjun's profile data
  const profile = data.profiles.find((p) => p.name === "김민준");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom();
    }
  }, [messages, activeTab]); // Scroll only when chat tab is active and messages change

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageToSend: Message = {
      id: Date.now(), // Simple unique ID
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, messageToSend]);
    setNewMessage("");
    // TODO: Send the message to a backend server
    // Note: scrollToBottom will be called automatically by the useEffect hook
  };

  // TODO: Implement automatic scrolling to the bottom when new messages arrive or component mounts.
  // You might use useRef and useEffect for this.

  const renderTabContent = () => {
    switch (activeTab) {
      case "chat":
        return (
          <>
            {/* Message List Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-xl ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-800 text-gray-300 rounded-bl-none"
                    }`}
                  >
                    <p className="text-base break-words">{message.text}</p>
                    <span className="text-xs text-gray-400 block text-right mt-1">
                      {message.timestamp}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              <div className="pb-4"></div> {/* Padding at bottom of list */}
            </div>

            {/* Message Input Area - Sticky at the bottom */}
            <div className="sticky bottom-0 z-10 bg-black/80 backdrop-blur-sm border-t border-gray-700 p-4">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 text-base resize-none"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
                  disabled={!newMessage.trim()}
                  aria-label="Send message"
                >
                  {/* Send Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 012 0v5.071a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </form>
            </div>
          </>
        );
      case "answers":
        return (
          <div className="p-4 text-center text-gray-500 flex-grow">
            <p>함께 답한 질문 내용이 여기에 표시됩니다.</p>
            {/* TODO: Implement logic to find and display shared answers */}
          </div>
        );
      case "links":
        return (
          <div className="p-4 text-center text-gray-500 flex-grow">
            <p>서로의 연결고리(공통 관심사 등)가 여기에 표시됩니다.</p>
            {/* TODO: Implement logic to find and display shared links/interests */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col max-w-[680px] mx-auto w-full">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-700 p-4 flex items-center justify-center space-x-3">
        {/* Profile Picture using data from JSON */}
        {profile ? (
          <Image
            src={profile.imageUrl}
            alt={`${profile.name} Profile Picture`}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          // Fallback placeholder if profile not found
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
            ?
          </div>
        )}
        <h1 className="text-lg font-semibold text-gray-200">김민준</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-3 text-center text-base font-medium ${
            activeTab === "chat"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          메시지
        </button>
        <button
          onClick={() => setActiveTab("answers")}
          className={`flex-1 py-3 text-center text-base font-medium ${
            activeTab === "answers"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          공통 답변
        </button>
        <button
          onClick={() => setActiveTab("links")}
          className={`flex-1 py-3 text-center text-base font-medium ${
            activeTab === "links"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          함께 아는 친구들
        </button>
      </div>

      {/* Tab Content Area - Takes remaining height */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {renderTabContent()}
      </div>
    </div>
  );
}
