"use client";

import {
  ProfileSm,
  ProfileMd,
  ProfileLg,
  ProfileMdBordered,
  ProfileSmAnswer,
  ProfileSmIndex,
} from "@/components/profile";
import data from "../../../data.json"; // Assuming data.json is at the root or configured path alias

export default function ProfileTestPage() {
  const { profiles, book_answers } = data;
  const profile1 = profiles.find((p) => p.id === "profile-1");
  const profile2 = profiles.find((p) => p.id === "profile-2");
  const profile3 = profiles.find((p) => p.id === "profile-3");
  const profile4 = profiles.find((p) => p.id === "profile-4"); // Long name profile

  // Find the first answer for profile1, profile2 and profile3
  const answer1 = book_answers.find((a) => a.profile_id === profile1?.id);
  const answer2 = book_answers.find((a) => a.profile_id === profile2?.id);
  const answer3 = book_answers.find((a) => a.profile_id === profile3?.id);
  const answer4 = book_answers.find((a) => a.profile_id === profile4?.id); // Fetch answer for profile4

  if (
    !profile1 ||
    !profile2 ||
    !profile3 ||
    !profile4 ||
    !answer1 ||
    !answer2 ||
    !answer3 ||
    !answer4 // Added check for answer4
  ) {
    return <div>Error loading profile or answer data.</div>;
  }

  return (
    <div className="container mx-auto p-8 space-y-12 bg-zinc-940 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Profile Components</h1>

      {/* ProfileSm Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ProfileSm</h2>
        {/* Updated layout to flex wrap, removed borders */}
        <div className="flex flex-wrap gap-6">
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSm {...profile1} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSm {...profile2} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSm {...profile3} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSm {...profile4} />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* ProfileSm Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ProfileSmIndex</h2>
        {/* Updated layout to flex wrap, removed borders */}
        <div className="flex flex-wrap gap-6">
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmIndex {...profile1} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmIndex {...profile2} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmIndex {...profile3} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmIndex {...profile4} />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* ProfileSmAnswer Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ProfileSmAnswer</h2>
        {/* Updated layout to flex wrap, removed borders, handling missing answer for profile4 */}
        <div className="flex flex-wrap gap-6">
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmAnswer
              {...profile1}
              answerTitle={answer1.title}
              answerText={answer1.answer_text}
            />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmAnswer
              {...profile2}
              answerTitle={answer2.title}
              answerText={answer2.answer_text}
            />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmAnswer
              {...profile3}
              answerTitle={answer3.title}
              answerText={answer3.answer_text}
            />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileSmAnswer
              {...profile4}
              answerTitle={answer4.title} // Use actual answer title
              answerText={answer4.answer_text} // Use actual answer text
            />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* ProfileMd Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ProfileMd</h2>
        {/* Updated layout to flex wrap, removed borders */}
        <div className="flex flex-wrap gap-6">
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileMd {...profile1} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileMd {...profile2} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileMd {...profile3} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileMd {...profile4} />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* ProfileMdBordered Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ProfileMdBordered</h2>
        {/* Updated layout to flex wrap, border is part of the component */}
        <div className="flex flex-wrap gap-6">
          {/* Removed padding from wrapper div as component has its own */}
          <div>
            <ProfileMdBordered {...profile1} />
          </div>
          <div>
            <ProfileMdBordered {...profile2} />
          </div>
          <div>
            <ProfileMdBordered {...profile3} />
          </div>
          <div>
            <ProfileMdBordered {...profile4} />
          </div>
        </div>
      </section>

      <hr className="my-12 border-zinc-700" />

      {/* ProfileLg Tests */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">ProfileLg</h2>
        {/* Updated layout to flex wrap, removed borders */}
        <div className="flex flex-wrap gap-6">
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileLg {...profile1} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileLg {...profile2} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileLg {...profile3} />
          </div>
          <div className="p-4">
            {" "}
            {/* Removed border classes */}
            <ProfileLg {...profile4} />
          </div>
        </div>
      </section>
    </div>
  );
}
