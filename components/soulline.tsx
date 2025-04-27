// components/soulline.tsx
"use client";

import React from "react";

// --- Profile 타입 정의 ---
export interface SoullineProps {
  imageUrl: string;
  name: string;
  altText?: string;
}

export function Soulline({ profiles }: { profiles: SoullineProps[] }) {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 이미지 + 선 */}
      <div className="flex items-center w-full h-16">
        {profiles.map((profile, idx) => (
          <React.Fragment key={profile.name}>
            {/* 아바타 크기: 64px */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={profile.imageUrl}
                alt={profile.altText ?? `${profile.name}'s profile picture`}
                className="absolute inset-0 w-full h-full rounded-full object-cover"
              />
            </div>
            {/* 마지막이 아니면 선 그리기 */}
            {idx < profiles.length - 1 && (
              <div
                className="flex-1 h-1 bg-cyan-400 shadow-[0_0_10px_0_rgba(0,255,255,0.7)]"
                aria-hidden="true"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 이름 행: 이미지 바로 아래, 같은 64px 영역 */}
      <div className="flex items-start w-full mt-2">
        {profiles.map((profile, idx) => (
          <React.Fragment key={profile.name}>
            <a
              href={`/profile`}
              className="w-16 hover:underline text-center text-white/95 text-lg"
            >
              <span className="">{profile.name}</span>
            </a>
            {idx < profiles.length - 1 && (
              <div className="flex-1" aria-hidden />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
