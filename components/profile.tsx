import React from "react";

// Props for ProfileSm and ProfileMd
export interface ProfileBaseProps {
  imageUrl: string;
  name: string;
  altText?: string; // Optional alt text, defaults to name's profile picture
}

// Props for ProfileLg, extends base props with bio
interface ProfileLgProps extends ProfileBaseProps {
  bio: string;
}

// Props for ProfileSmAnswer, extends base props with answerText
interface ProfileSmAnswerProps extends ProfileBaseProps {
  answerTitle: string;
  answerText: string;
}

// Small Profile Component
export function ProfileSm({ imageUrl, name, altText }: ProfileBaseProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-6 h-6">
        <img
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          className="absolute inset-0 w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="text-sm text-white/95 cursor-pointer hover:underline">
        {name}
      </span>
    </div>
  );
}

export function ProfileSmIndex({ imageUrl, name, altText }: ProfileBaseProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-6 h-6">
        <img
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          className="absolute inset-0 w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="text-sm text-white/60">{name}</span>
    </div>
  );
}

// Small Profile Component with Answer
export function ProfileSmAnswer({
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
        <a
          href="/profile/answer/detail"
          className="text-xl font-semibold text-white/95 cursor-pointer hover:underline"
        >
          {answerTitle}
        </a>
        <p className="text-base text-white/60 mt-1.5 line-clamp-2">
          {answerText}
        </p>
      </div>
    </div>
  );
}

// Medium Profile Component
export function ProfileMd({ imageUrl, name, altText }: ProfileBaseProps) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-16 h-16">
        <img
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          className="absolute inset-0 w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="text-lg text-white/95 mt-2 text-center cursor-pointer hover:underline">
        {name}
      </span>
    </div>
  );
}

// Medium Profile Component with Border
export function ProfileMdBordered({
  imageUrl,
  name,
  altText,
}: ProfileBaseProps) {
  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative w-18 h-18 p-1 rounded-full bg-cyan-400 shadow-[0_0_10px_0_rgba(0,255,255,0.7)]">
        <div className="relative w-16 h-16">
          <img
            src={imageUrl}
            alt={altText ?? `${name}'s profile picture`}
            className="absolute inset-0 w-full h-full rounded-full object-cover"
          />
        </div>
      </div>
      <span className="text-lg text-white/95 mt-2 text-center cursor-pointer hover:underline">
        {name}
      </span>
    </div>
  );
}

// Large Profile Component
export function ProfileLg({ imageUrl, name, bio, altText }: ProfileLgProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 mb-4">
        <img
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          className="absolute inset-0 w-full h-full rounded-full object-cover"
        />
      </div>
      <span className="text-2xl text-white/95 cursor-pointer font-semibold hover:underline mb-4">
        {name}
      </span>
      <p className="text-xl text-white/60 font-['NanumMyeongjo'] w-[400px]">
        {bio}
      </p>
    </div>
  );
}
