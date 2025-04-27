// components/SoulLinkItem.tsx
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ProfileSm } from "@/components/profile";

export interface ItemProps {
  imageUrl: string;
  name: string;
  requestDate?: Date;
  actions?: React.ReactNode;
}

export function Item({ imageUrl, name, requestDate, actions }: ItemProps) {
  const timeElapsedText = requestDate
    ? formatDistanceToNow(requestDate, { addSuffix: true, locale: ko })
    : "";

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-md border border-white/15">
      {/* 프로필 + 텍스트 */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 relative flex-shrink-0">
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-base text-white/95">{name}님과의 소울링크</p>
          {requestDate && (
            <p className="text-sm text-white/65">{timeElapsedText}</p>
          )}
        </div>
      </div>

      {/* 액션 버튼 등 */}
      {actions && <div className="flex items-center space-x-2">{actions}</div>}
    </div>
  );
}

export function ItemAnswerBook({
  imageUrl,
  answerTitle,
  answerText,
  altText,
}: ItemAnswerBookProps) {
  return (
    <div className="flex space-x-4 items-center">
      <div className="flex-shrink-0">
        <Image
          src={imageUrl}
          alt={altText ?? `${answerTitle} cover`}
          width={55}
          height={90}
          className="object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden mt-1">
        <Link href="/profile/answer/detail">
          <span className="text-xl font-semibold text-white/95 cursor-pointer hover:underline">
            {answerTitle}
          </span>
        </Link>
        <p className="text-base text-white/60 mt-1.5 line-clamp-2">
          {answerText}
        </p>
      </div>
    </div>
  );
}

export function ItemAnswerProfile({
  imageUrl,
  name,
  altText,
  answerTitle,
  answerText,
}: ProfileSmAnswerProps) {
  return (
    <div className="flex flex-col">
      <ProfileSm imageUrl={imageUrl} name={name} altText={altText} />
      <div className="flex flex-col flex-1 overflow-hidden mt-5">
        <Link href="/profile/answer/detail">
          <span className="text-xl font-semibold text-white/95 cursor-pointer hover:underline">
            {answerTitle}
          </span>
        </Link>
        <p className="text-base text-white/60 mt-1.5 line-clamp-2">
          {answerText}
        </p>
      </div>
    </div>
  );
}
