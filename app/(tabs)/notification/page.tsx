import React from "react"; // Ensure React is imported for JSX
// import Image from "next/image"; // Removed unused import

// Mock Data - Updated avatarUrls
const notifications = [
  // Today
  {
    id: 1,
    // Assuming Han Kang corresponds to profile1.png
    user: { name: "한강", avatarUrl: "/profiles/profile1.png" },
    message: "한강님과의 소울링크가 생성되었어요",
    timestamp: "4시간 전",
    isRead: false,
    section: "today",
    subText: null,
  },
  {
    id: 2,
    // Assuming O-Ryeong corresponds to profile2.png
    user: { name: "어령", avatarUrl: "/profiles/profile2.png" },
    message: "어령님과의 매치가 생성되었어요",
    timestamp: "8시간 전",
    isRead: false,
    section: "today",
    subText: null,
  },
  {
    id: 3,
    // Assuming Kokubun Koichiro corresponds to profile3.png
    user: { name: "고쿠분 고이치로", avatarUrl: "/profiles/profile3.png" },
    message: "고쿠분 고이치로 작가님의 편지가 도착했어요",
    timestamp: "12시간 전",
    isRead: true,
    section: "today",
    subText: "책임의 생성",
  },
  // Last Week
  {
    id: 4,
    // Assuming Namjoon corresponds to profile4.png
    user: { name: "남준", avatarUrl: "/profiles/profile4.png" },
    message: "남준님과 공통 관심 질문이 생겼어요",
    timestamp: "지난 주", // Timestamp less relevant for grouped 'Last Week'
    isRead: true,
    section: "lastWeek",
    subText: null,
  },
  {
    id: 5,
    // Assuming Vitalik Buterin corresponds to profile5.png
    user: { name: "비탈릭 부테린", avatarUrl: "/profiles/profile5.png" },
    message: "비탈릭 부테린님의 새로운 질문이 도착했어요",
    timestamp: "지난 주", // Timestamp less relevant for grouped 'Last Week'
    isRead: true,
    section: "lastWeek",
    subText: null,
  },
];

// Function to highlight keywords in the message
// Explicitly type the return value as React.ReactNode
const HighlightedMessage = ({
  message,
}: {
  message: string;
}): React.ReactNode => {
  const keywords = ["소울링크", "매치", "편지", "질문"];
  let parts: (string | React.ReactElement)[] = [message]; // Use React.ReactElement for JSX

  keywords.forEach((keyword) => {
    const newParts: (string | React.ReactElement)[] = [];
    parts.forEach((part, index) => {
      if (typeof part === "string") {
        const splitParts = part.split(keyword);
        for (let i = 0; i < splitParts.length; i++) {
          newParts.push(splitParts[i]);
          if (i < splitParts.length - 1) {
            // Using index and i for a more unique key component
            newParts.push(
              <span
                key={`${keyword}-${index}-${i}`}
                className="text-[#6ABECF] font-semibold"
              >
                {keyword}
              </span>
            );
          }
        }
      } else {
        // Keep existing JSX elements (like previously highlighted keywords)
        newParts.push(part);
      }
    });
    // Filter out empty strings that might result from splitting at the beginning/end
    parts = newParts.filter((p) => p !== "");
  });

  return <>{parts}</>;
};

export default function NotificationPage() {
  const todayNotifications = notifications.filter((n) => n.section === "today");
  const lastWeekNotifications = notifications.filter(
    (n) => n.section === "lastWeek"
  );

  return (
    // Updated main container styles
    <div className="font-sans min-h-screen bg-zinc-950 text-white p-4 flex flex-col pt-12">
      <div className="max-w-[680px] mx-auto w-full flex-grow">
        {/* Today Section */}
        {todayNotifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl text-white/90 font-['NanumMyeongjo'] mb-4">
              오늘
            </h2>
            <ul className="space-y-3">
              {todayNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-md border border-white/10"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <img
                      src={notification.user.avatarUrl}
                      alt={`${notification.user.name} avatar`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-base text-white/90">
                        <HighlightedMessage message={notification.message} />
                      </p>
                      <p className="text-sm text-white/65 mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="w-2.5 h-2.5 bg-[#6ABECF] rounded-full flex-shrink-0 ml-3"></div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Last Week Section */}
        {lastWeekNotifications.length > 0 && (
          <section className="mb-8 mt-12">
            <h2 className="text-xl text-white/90 font-['NanumMyeongjo'] mb-4">
              지난 주
            </h2>
            <ul className="space-y-3">
              {lastWeekNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center p-4 bg-white/5 rounded-md border border-white/10"
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <img
                      src={notification.user.avatarUrl}
                      alt={`${notification.user.name} avatar`}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      {notification.subText && (
                        <p className="text-sm text-white/65 truncate mb-0.5">
                          {notification.subText}
                        </p>
                      )}
                      <p className="text-base text-white/90">
                        <HighlightedMessage message={notification.message} />
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Empty State (Optional) */}
        {todayNotifications.length === 0 &&
          lastWeekNotifications.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              알림이 없습니다.
            </div>
          )}
      </div>
    </div>
  );
}
