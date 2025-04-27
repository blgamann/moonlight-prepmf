"use client";

import { Tabs } from "@/components/tabs";

export default function Page() {
  const tabItems = [
    {
      label: "질문",
      value: "questions",
      content: (
        <div className="text-white/95">여기에 질문 리스트를 렌더링하세요.</div>
      ),
    },
    {
      label: "이벤트",
      value: "events",
      content: (
        <div className="text-white/95">
          여기에 이벤트 리스트를 렌더링하세요.
        </div>
      ),
    },
  ];

  return <Tabs tabs={tabItems} />;
}
