"use client";

import React from "react";
import { Soulline, SoullineProps } from "@/components/soulline";
import data from "../../../data.json";

const SoullinePage = () => {
  // data.profiles 자체가 SoulProfileProps[] 형태여야 합니다.
  // 필요하다면 아래처럼 매핑하세요:
  const profiles: SoullineProps[] = data.profiles.map((p) => ({
    imageUrl: p.imageUrl,
    name: p.name,
    altText: `Profile picture of ${p.name}`,
  }));

  return (
    <section className="max-w-[680px] mx-auto p-8">
      <h1 className="text-3xl font-bold mb-12 text-white">Soulline</h1>

      {[2, 3, 4, 5].map((degree) => (
        <div key={degree} className="mb-12 flex flex-col space-y-12">
          <div className="flex flex-col items-center">
            <span className="text-lg text-center text-gray-400 mb-4">
              {degree - 1}촌
            </span>
            <div className="w-full max-w-2xl mx-auto">
              <Soulline profiles={profiles.slice(0, degree)} />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default SoullinePage;
