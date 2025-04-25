import Image from "next/image";
import Link from "next/link";

interface UserProfile {
  name: string;
  imageUrl: string;
}

interface SoulLineProps {
  users: UserProfile[];
}

export default function SoulLine({ users }: SoulLineProps) {
  return (
    <div className="w-full max-w-[680px] mx-auto border-t border-white/30 py-8">
      <div className="flex items-center gap-1.5 mb-8">
        <h2 className="text-xl text-white/90 font-semibold">소울라인</h2>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5.5 h-5.5 text-white/60 mb-0.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
          />
        </svg>
      </div>

      <div className="relative flex items-start justify-between px-8">
        {/* Connecting Line */}
        <div className="absolute left-16 right-16 top-8 h-0.5 bg-[#38d4e7] shadow-[0_0_10px_#38d4e7]"></div>

        {/* Users */}
        {users.map((user, index) => (
          <div key={index} className="z-10 flex flex-col items-center gap-2">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-black">
              {/* Placeholder Image - Replace with actual Image component and src */}
              <Image
                src={user.imageUrl} // Replace with actual image path
                alt={user.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
                // Add placeholder style if needed
                // style={{ filter: 'blur(5px)' }}
              />
            </div>
            <Link
              href="/profile"
              className="text-base text-white/80 hover:underline cursor-pointer"
            >
              {user.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
