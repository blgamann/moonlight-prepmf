"use client";

import data from "@/data.json";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// Define types
type DetailTab = "messages" | "questions" | "friends";
type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string; // Simple timestamp for now
};

// Fix Profile type definition
type Profile = (typeof data.profiles)[0] & {
  status?: string;
  // Changed to message count
  newMessageCount?: number | null;
};

// Select the first 5 profiles for display, adding mock message counts
const soulLinkProfiles: Profile[] = data.profiles
  .slice(0, 5)
  .map((p, index) => ({
    ...p,
    // Simulate different message counts
    newMessageCount: index === 1 ? 3 : index === 3 ? 1 : null,
  }));

// Placeholder data for the waiting list
const waitingProfiles: Profile[] = data.profiles
  .slice(0, 2)
  .map((p, index) => ({
    ...p,
    status: `${(index + 1) * 13}일 경과`,
  }));

// Placeholder data for the floating list
const floatingProfiles: Profile[] = data.profiles
  .slice(2, 4)
  .map((p, index) => ({
    ...p,
    status: `${(index + 1) * 8}일 경과`,
  }));

// Placeholder for the current user's profile - replace with actual logic
const currentUserProfile: Profile = data.profiles[0];
// Assume conversation is about the first book
const conversationBook = data.books[0];

// Define Question type and simulated data
type Question = {
  id: string;
  title: string;
  description: string;
  answerCount: number;
  book: (typeof data.books)[0];
  answers: {
    [profileId: string]: {
      text: string;
      date: string;
    };
  };
};

const simulatedQuestions: Question[] = [
  {
    id: "q1",
    title:
      "영혜처럼 사회적 시선이나 통념에 맞서 '다른' 선택을 해본 경험이 있나요?",
    description:
      "소설 속 영혜는 폭력적인 꿈을 꾼 뒤 육식을 거부하며 사회가 요구하는 '정상성'에서 벗어납니다. 그녀의 선택은 가족과의 갈등을 야기하지만, 동시에 자신만의 신념을 따르는 여정의 시작이기도 합니다. 영혜의 모습에 비추어, 사회적 통념에 맞서 자신만의 가치를 추구했던 경험이 있는지 돌아봅시다.",
    answerCount: 78,
    book: data.books[0],
    answers: {
      [currentUserProfile.id]: {
        text: "사회적 통념보다는 제 자신의 가치관을 따르려고 노력하는 편입니다. 예를 들어, 모두가 '안정적인' 직장을 선호할 때, 저는 '의미있는' 일을 찾아 스타트업에 합류했습니다. 쉽지 않은 결정이었지만, 스스로에게 떳떳하고 싶었어요.",
        date: "2025. 5. 10.",
      },
      "profile-2": {
        text: "저는 아직 사회적 시선에서 자유롭지 못한 것 같아요. 영혜처럼 '다른' 선택을 한다는 것이 얼마나 큰 용기가 필요한 일인지 새삼 느낍니다. 하지만 저도 언젠가는 제 목소리를 낼 수 있기를 바라요.",
        date: "2025. 5. 11.",
      },
    },
  },
  {
    id: "q2",
    title:
      "소설 속 폭력적인 장면(꿈, 아버지의 폭력 등) 중 가장 인상 깊었거나 불편했던 장면은 무엇인가요? 그 이유는?",
    description:
      "작품은 단순히 육식 거부를 넘어, 인간 사회에 내재된 다양한 형태의 폭력성을 고발합니다. 가정 내에서의 억압, 사회적 편견, 타인에 대한 무관심 등, 영혜가 겪는 고통은 여러 층위의 폭력과 연결됩니다. 우리 주변에서 발견할 수 있는 다양한 폭력의 양상에 대해 이야기해 봅시다.",
    answerCount: 23,
    book: data.books[1],
    answers: {
      [currentUserProfile.id]: {
        text: "아버지의 폭력 장면이 가장 불편했습니다. 가정이라는 가장 안전해야 할 공간에서 자행되는 폭력은 어떤 이유로도 정당화될 수 없다고 생각합니다. 영혜가 겪었을 공포와 절망감이 느껴져 마음이 아팠습니다.",
        date: "2025. 5. 12.",
      },
      "profile-2": {
        text: "저는 영혜의 꿈 장면들이 인상 깊었어요. 잔혹하지만 동시에 강렬한 이미지들이 그녀의 내면 깊은 곳의 상처와 변화의 갈망을 보여주는 것 같았습니다. 꿈을 통해 현실의 억압을 표출하는 방식이 독특하게 다가왔습니다.",
        date: "2025. 5. 13.",
      },
    },
  },
  {
    id: "q3",
    title:
      "영혜의 채식 선언은 단순한 식습관 변화일까요, 아니면 더 깊은 의미(저항, 자기 파괴, 구원 등)를 담고 있을까요?",
    description:
      "영혜는 점차 인간이기를 포기하고 나무가 되기를 갈망하며 식물적인 삶을 꿈꿉니다. 이는 현실의 고통과 폭력으로부터 완전히 벗어나고자 하는 극단적인 소망의 표현일 수 있습니다. 현실의 어려움에서 벗어나 다른 존재가 되고 싶은 욕망에 대해 생각해 봅시다.",
    answerCount: 47,
    book: data.books[2],
    answers: {
      [currentUserProfile.id]: {
        text: "단순한 식습관 변화 이상의 의미, 즉 기존 질서에 대한 저항이라고 생각합니다. 폭력으로 가득 찬 세상에서 벗어나려는 영혜의 절박한 몸부림이 채식이라는 형태로 나타난 것이 아닐까요?",
        date: "2025. 5. 14.",
      },
      "profile-2": {
        text: "저는 자기 파괴적인 면도 있다고 느꼈어요. 인간성을 거부하고 식물이 되려는 것은 현실로부터의 도피를 넘어 자기 자신을 소멸시키려는 욕망처럼 보이기도 했습니다. 물론, 구원의 가능성도 내포하고 있겠지만요.",
        date: "2025. 5. 15.",
      },
    },
  },
];

// Simulated chat messages function
const generateSimulatedMessages = (
  profile1Id: string,
  profile2Id: string
): Message[] => [
  {
    id: "msg1",
    senderId: profile1Id,
    text: `『${conversationBook.title}』 읽어보셨어요? 마지막 장면이 정말 인상 깊더라고요.`,
    timestamp: "10:30 AM",
  },
  {
    id: "msg2",
    senderId: profile2Id,
    text: "네, 저도요! 특히 영혜가 나무가 되려는 모습이 여러 생각을 하게 만들었어요.",
    timestamp: "10:32 AM",
  },
  {
    id: "msg3",
    senderId: profile1Id,
    text: "맞아요. 현실 도피 같기도 하고, 가장 순수한 상태를 갈망하는 것 같기도 하고... 해석이 갈리죠?",
    timestamp: "10:33 AM",
  },
  {
    id: "msg4",
    senderId: profile2Id,
    text: "저는 후자에 좀 더 마음이 가더라고요. 인간 사회의 폭력성에서 벗어나고 싶다는 절박함이 느껴졌어요.",
    timestamp: "10:35 AM",
  },
  {
    id: "msg5",
    senderId: profile1Id,
    text: "일리 있네요. 형부의 예술과 영혜의 식물성이 대비되는 지점도 흥미로웠어요.",
    timestamp: "10:36 AM",
  },
  {
    id: "msg6",
    senderId: profile2Id,
    text: "오, 그 부분! 저도 인상 깊었어요. 예술마저도 어떤 면에서는 폭력적일 수 있다는 걸 보여주는 것 같아서요.",
    timestamp: "10:38 AM",
  },
  {
    id: "msg7",
    senderId: profile1Id,
    text: "맞아요. 소유욕이나 대상화 같은... 생각할 거리를 많이 던져주는 소설이에요.",
    timestamp: "10:40 AM",
  },
  {
    id: "msg8",
    senderId: profile2Id,
    text: "그래서 더 여운이 남는 것 같아요. 혹시 작가님의 다른 작품도 읽어보셨나요?",
    timestamp: "10:41 AM",
  },
  {
    id: "msg9",
    senderId: profile1Id,
    text: "아뇨, 아직요. 『소년이 온다』를 많이 추천하던데, 읽어봐야겠어요.",
    timestamp: "10:42 AM",
  },
  {
    id: "msg10",
    senderId: profile2Id,
    text: "저도 그거 읽고 충격받았어요... 같이 읽고 이야기 나눠도 좋겠네요!",
    timestamp: "10:43 AM",
  },
];

// --- Chat Interface Component ---
const ChatInterface = ({
  user,
  otherProfile,
}: {
  user: Profile;
  otherProfile: Profile;
}) => {
  // State moved back into ChatInterface
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Load messages when component mounts or otherProfile changes
  useEffect(() => {
    setMessages(generateSimulatedMessages(user.id, otherProfile.id));
    setNewMessage("");
  }, [user.id, otherProfile.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handler moved back into ChatInterface
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageToSend: Message = {
      id: `msg${messages.length + 1}`,
      senderId: user.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };

    const updatedMessages = [...messages, messageToSend];
    setMessages(updatedMessages);
    setNewMessage("");

    // Simulate reply
    setTimeout(() => {
      const replyMessage: Message = {
        id: `msg${updatedMessages.length + 1}`,
        senderId: otherProfile.id,
        text: "흥미로운 관점이네요! 😄",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
      setMessages((prevMessages) => [...prevMessages, replyMessage]);
    }, 1500);
  };

  return (
    // Removed fixed height, added flex-grow to fill parent when parent is flex-col
    <div className="flex flex-col flex-grow">
      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === user.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow-sm ${
                msg.senderId === user.id
                  ? "bg-cyan-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <p
                className={`text-xs mt-1 ${
                  msg.senderId === user.id ? "text-cyan-100" : "text-gray-400"
                } text-right`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Area */}
      <div className="border-t p-3 bg-white flex items-center space-x-2 flex-shrink-0">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="메시지를 입력하세요..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
        />
        <button
          onClick={handleSendMessage}
          className="bg-cyan-500 text-white rounded-full p-2 hover:bg-cyan-600 disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.789 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.69l-3 3V16l-4-4 4-4v1.29l3-3V4.429A1 1 0 009 3.429l5-1.429a1 1 0 001.169-1.409l-7-14zm-1.789 0l7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 0018 16.571V11.69l-3 3V16l-4-4 4-4v1.29l3-3V4.429A1 1 0 0018 3.429l5-1.429a1 1 0 001.169-1.409z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Updated QuestionsContent to display a list of questions with expandable answers
const QuestionsContent = ({
  questions,
  currentUserProfile,
  selectedProfile,
  expandedQuestionId,
  setExpandedQuestionId,
}: {
  questions: Question[];
  currentUserProfile: Profile;
  selectedProfile: Profile;
  expandedQuestionId: string | null;
  setExpandedQuestionId: (id: string | null) => void;
}) => {
  const formatDate = (dateString: string | undefined) => {
    return dateString || ""; // Return empty string if date is undefined
  };

  // Use selectedProfile's actual ID for answers
  const selectedProfileAnswers = questions.reduce((acc, q) => {
    // Find the answer key that is NOT the current user's ID
    const otherKey = Object.keys(q.answers).find(
      (id) => id !== currentUserProfile.id
    );
    if (otherKey) {
      acc[q.id] = q.answers[otherKey];
    }
    return acc;
  }, {} as { [questionId: string]: { text: string; date: string } });

  return (
    <div className="space-y-8 py-4">
      {questions.map((question) => {
        const isExpanded = expandedQuestionId === question.id;
        const currentUserAnswer = question.answers[currentUserProfile.id];
        // const selectedProfileAnswer = question.answers[selectedProfile.id]; // Use dynamic key access later if needed
        const selectedProfileAnswer = selectedProfileAnswers[question.id];

        return (
          <div
            key={question.id}
            className="border-b pb-6 last:border-b-0 last:pb-0"
          >
            {/* Book Info Section */}
            <div className="flex items-center mb-4">
              <Image
                src={question.book.imageUrl}
                alt={question.book.title}
                width={40}
                height={60}
                className="rounded-md shadow-sm mr-4 flex-shrink-0"
              />
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {question.book.author}의 『{question.book.title}』
              </h2>
            </div>
            {/* Question Details */}
            <h3 className="text-base font-semibold text-gray-800 mb-2 leading-snug">
              {question.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {question.description}
            </p>
            <div className="flex justify-end items-center text-sm">
              <button
                onClick={() =>
                  setExpandedQuestionId(isExpanded ? null : question.id)
                }
                className="text-cyan-600 hover:underline mr-4 focus:outline-none"
              >
                {isExpanded ? "답변 숨기기" : "답변보기"}
              </button>
            </div>

            {/* Expanded Answer Section */}
            {isExpanded && currentUserAnswer && selectedProfileAnswer && (
              <div className="mt-6 space-y-6 pt-6 border-t border-gray-200">
                {/* Selected Profile Answer (Left Profile, Right Text) */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center w-16 flex-shrink-0 text-center">
                    <Image
                      src={selectedProfile.imageUrl}
                      alt={selectedProfile.name}
                      width={48}
                      height={48}
                      className="rounded-full mb-1.5"
                    />
                    <span className="font-semibold text-xs text-gray-700">
                      {selectedProfile.name}
                    </span>
                  </div>
                  <div className="flex-1 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                      {selectedProfileAnswer.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 text-right">
                      {formatDate(selectedProfileAnswer.date)}
                    </p>
                  </div>
                </div>

                {/* Current User Answer (Left Text, Right Profile) */}
                <div className="flex items-start gap-4">
                  <div className="flex-1 bg-cyan-50 p-4 rounded-md text-right">
                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line text-left">
                      {currentUserAnswer.text}
                    </p>
                    <p className="text-xs text-cyan-600 mt-2">
                      {formatDate(currentUserAnswer.date)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center w-16 flex-shrink-0 text-center">
                    <Image
                      src={currentUserProfile.imageUrl}
                      alt={currentUserProfile.name}
                      width={48}
                      height={48}
                      className="rounded-full mb-1.5"
                    />
                    <span className="font-semibold text-xs text-gray-700">
                      {currentUserProfile.name} (나)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const FriendsContent = ({ mutualFriends }: { mutualFriends: Profile[] }) => {
  if (!mutualFriends || mutualFriends.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        함께 아는 친구 정보가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">
        함께 아는 친구 {mutualFriends.length}명
      </h3>
      {mutualFriends.map((profile) => (
        <div
          key={profile.id}
          className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
          // Add onClick later if needed to navigate to friend's profile
        >
          <Image
            src={profile.imageUrl}
            alt={profile.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium text-gray-700">{profile.name}</span>
        </div>
      ))}
    </div>
  );
};

export default function SoulLinkPage() {
  // State for the default view (Waiting/Floating tabs)
  const [activeMainTab, setActiveMainTab] = useState<"waiting" | "floating">(
    "waiting"
  );

  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProfile, setModalProfile] = useState<Profile | null>(null);

  // State for the profile selected from the top list
  const [selectedListProfile, setSelectedListProfile] =
    useState<Profile | null>(null);
  // State for the active tab in the detail view
  const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>("messages");
  // State for expanded question in QuestionsContent
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(
    null
  );

  const openModal = (profile: Profile) => {
    setModalProfile(profile);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalProfile(null);
  };

  return (
    <>
      <div
        className={`w-full px-4 py-6 space-y-6 ${
          selectedListProfile && activeDetailTab === "messages" ? "pb-24" : ""
        }`}
      >
        {/* Soul Link Profiles Card (Conditionally Rendered) */}
        {!selectedListProfile && (
          <div className="w-full bg-white p-6 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
            <div className="max-w-[680px] mx-auto">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Soul Link Profiles
              </h2>
              <div className="space-y-4">
                {soulLinkProfiles.map((profile) => (
                  <div
                    key={profile.id}
                    onClick={() => {
                      setSelectedListProfile(profile);
                      setActiveDetailTab("messages");
                    }}
                    className={`flex items-center justify-between space-x-3 p-2 rounded hover:bg-gray-100 cursor-pointer`}
                  >
                    <div className="flex items-center space-x-3">
                      <Image
                        src={profile.imageUrl}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-medium text-gray-700">
                        {profile.name}
                      </span>
                    </div>

                    {/* New Message Count Indicator */}
                    {profile.newMessageCount && profile.newMessageCount > 0 && (
                      <span
                        className="bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
                        title={`${profile.newMessageCount} new messages`}
                      >
                        {profile.newMessageCount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Breadcrumb Card (visible only when a profile is selected) */}
        {selectedListProfile && (
          <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
            <div className="max-w-[680px] mx-auto px-6 py-3">
              <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
                <ol className="flex items-center space-x-1">
                  <li>
                    <button
                      onClick={() => setSelectedListProfile(null)}
                      className="hover:text-gray-700 hover:underline"
                    >
                      소울링크
                    </button>
                  </li>
                  <li>
                    {/* Use > separator */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mx-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </li>
                  <li>
                    <span className="font-medium text-gray-700 truncate">
                      {selectedListProfile.name}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        )}

        {/* Conditional Second Card: Detail View or Main Tab View */}
        {selectedListProfile ? (
          // Detail View Card (3 Tabs)
          <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
            <div className="max-w-[680px] mx-auto">
              {/* Detail Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveDetailTab("messages")}
                  className={`flex-1 py-3 text-center font-medium text-sm ${
                    activeDetailTab === "messages"
                      ? "text-cyan-500 border-b-2 border-cyan-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  메시지
                </button>
                <button
                  onClick={() => setActiveDetailTab("questions")}
                  className={`flex-1 py-3 text-center font-medium text-sm ${
                    activeDetailTab === "questions"
                      ? "text-cyan-500 border-b-2 border-cyan-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  함께 답한 질문
                </button>
                <button
                  onClick={() => setActiveDetailTab("friends")}
                  className={`flex-1 py-3 text-center font-medium text-sm ${
                    activeDetailTab === "friends"
                      ? "text-cyan-500 border-b-2 border-cyan-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  함께 아는 친구들
                </button>
              </div>

              {/* Detail Content Area - Dynamically applies flex-col */}
              <div
                className={`min-h-[300px] ${
                  activeDetailTab === "messages" ? "flex flex-col" : ""
                }`}
              >
                {activeDetailTab === "messages" && (
                  <ChatInterface
                    user={currentUserProfile}
                    otherProfile={selectedListProfile}
                  />
                )}
                {activeDetailTab === "questions" && (
                  <div className="p-4 md:p-6">
                    {/* Pass simulatedQuestions to QuestionsContent */}
                    <QuestionsContent
                      questions={simulatedQuestions}
                      currentUserProfile={currentUserProfile} // Pass current user profile
                      selectedProfile={selectedListProfile!} // Pass selected profile (non-null asserted)
                      expandedQuestionId={expandedQuestionId}
                      setExpandedQuestionId={setExpandedQuestionId}
                    />
                  </div>
                )}
                {activeDetailTab === "friends" && (
                  <div className="p-4 md:p-6">
                    {selectedListProfile &&
                      (() => {
                        const mutualFriends = data.profiles
                          .filter(
                            (p) =>
                              p.id !== currentUserProfile.id &&
                              p.id !== selectedListProfile.id
                          )
                          .slice(0, 5);
                        return <FriendsContent mutualFriends={mutualFriends} />;
                      })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Main Tab View Card (Waiting/Floating)
          <div className="w-full bg-white rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.1)]">
            <div className="max-w-[680px] mx-auto">
              {/* Main Tabs */}
              <div className="flex border-b">
                <button
                  onClick={() => setActiveMainTab("waiting")}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeMainTab === "waiting"
                      ? "text-cyan-500 border-b-2 border-cyan-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  대기 중
                </button>
                <button
                  onClick={() => setActiveMainTab("floating")}
                  className={`flex-1 py-3 text-center font-medium ${
                    activeMainTab === "floating"
                      ? "text-cyan-500 border-b-2 border-cyan-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  띄우기
                </button>
              </div>

              {/* Main Content Area */}
              <div className="p-4 md:p-6">
                {activeMainTab === "waiting" && (
                  <div className="space-y-4">
                    {waitingProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between space-x-4 p-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={profile.imageUrl}
                            alt={profile.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {profile.name}님과의 소울링크
                            </p>
                            <p className="text-sm text-gray-500">
                              {profile.status}
                            </p>
                          </div>
                        </div>
                        <button className="px-4 py-1.5 border border-red-500 text-red-500 rounded-full text-sm font-medium hover:bg-red-50 whitespace-nowrap">
                          내리기
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {activeMainTab === "floating" && (
                  <div className="space-y-4">
                    {floatingProfiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="flex items-center justify-between space-x-4 p-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center space-x-4">
                          <Image
                            src={profile.imageUrl}
                            alt={profile.name}
                            width={50}
                            height={50}
                            className="rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {profile.name}님과의 소울링크
                            </p>
                            <p className="text-sm text-gray-500">
                              {profile.status}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => openModal(profile)}
                          className="px-4 py-1.5 bg-cyan-500 text-white rounded-full text-sm font-medium hover:bg-cyan-600 whitespace-nowrap"
                        >
                          소울링크 띄우기
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal (No changes needed here) */}
      {isModalOpen && modalProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            {/* Close Button */}
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

            {/* Modal Header */}
            <div className="flex items-center mb-6">
              <Image
                src={modalProfile.imageUrl}
                alt={modalProfile.name}
                width={40}
                height={40}
                className="rounded-full mr-3"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {modalProfile.name}님과의{" "}
                <span className="text-cyan-500">소울링크</span>를 띄워볼까요?
              </h3>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={() => {
                  /* TODO: Implement 'Yes' action */ closeModal();
                }}
                className="flex-1 bg-cyan-500 text-white h-12 px-4 rounded-lg font-medium hover:bg-cyan-600 transition flex items-center justify-center text-center"
              >
                네
              </button>
              <button
                onClick={closeModal}
                className="flex-1 border border-cyan-500 text-cyan-500 h-12 px-4 rounded-lg font-medium hover:bg-cyan-50 transition flex items-center justify-center text-center whitespace-pre-line"
              >
                {"아직이요,\n좀 더 시간을 가져볼게요"}
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center text-sm text-gray-600 space-y-2 mb-6">
              <p>
                소울링크를 띄우기 위해서는{" "}
                <span className="font-semibold text-purple-600">500원</span>이
                소요됩니다.
              </p>
              <p>두 분 모두 소울링크를 띄운 경우에만 소울링크가 형성됩니다.</p>
            </div>

            {/* Connection Visual */}
            <div className="flex items-center justify-between px-4">
              <Image
                src={currentUserProfile.imageUrl} // Placeholder for current user
                alt={currentUserProfile.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              {/* Arrow SVG or simple line */}
              <svg
                width="100"
                height="20"
                viewBox="0 0 100 20"
                className="text-cyan-400 mx-2 flex-grow"
              >
                <line
                  x1="0"
                  y1="10"
                  x2="100"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="90,5 100,10 90,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="10,5 0,10 10,15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
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
    </>
  );
}
