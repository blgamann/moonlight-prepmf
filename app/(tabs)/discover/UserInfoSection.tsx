import Image from "next/image";
import Link from "next/link";
// import Link from "next/link";

// Define the shape of the user data prop
interface User {
  name: string;
  imageUrl: string;
  bio?: string;
}

// Define the props for the component
interface UserInfoSectionProps {
  user: User;
}

// Define the UserInfoSection component
export default function UserInfoSection({ user }: UserInfoSectionProps) {
  return (
    <section className="flex flex-col items-center">
      {/* Profile Image */}
      <div className="relative w-36 h-36 mb-4">
        <Image
          src={user.imageUrl}
          alt={`${user.name}'s profile picture`}
          fill={true}
          className="rounded-full object-cover"
        />
      </div>

      {/* Name - Centered */}
      {/* TODO: Decide if this should still be a link */}
      <Link href="/profile">
        <span className="text-2xl font-semibold text-center text-white/90 cursor-pointer hover:underline">
          {user.name}
        </span>
      </Link>

      {/* Bio - Centered */}
      <p className="text-xl text-white/85 font-['NanumMyeongjo'] w-[400px] leading-[1.8] mt-6">
        {user.bio}
      </p>
    </section>
  );
}
