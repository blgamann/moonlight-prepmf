import Image from "next/image";

// Define the shape of the user data prop
interface User {
  name: string;
  imageUrl: string;
  bio?: string;
}

// Define the props for the component
interface UserInfoSectionProps {
  user: User;
  booksReadCount: number;
}

// Define the UserInfoSection component
export default function UserInfoSection({
  user,
  booksReadCount,
}: UserInfoSectionProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center space-x-4">
        {/* Profile Image - Updated with container */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <Image
            src={user.imageUrl}
            alt={`${user.name}'s profile picture`}
            fill={true}
            className="rounded-full object-cover"
          />
        </div>
        {/* Text Content - Allow it to grow and align items within */}
        <div className="flex flex-col pt-1 flex-grow">
          {/* Name - Make interactive */}
          <h1 className="text-xl font-semibold text-white mb-1">
            <span className="cursor-pointer hover:text-gray-200">
              {user.name}
            </span>
          </h1>
          {/* Bio */}
          <p className="text-sm text-gray-300 mb-3">{user.bio}</p>
          {/* Stats - Make value interactive */}
          <div>
            <span className="text-sm text-gray-400">읽은 책 </span>
            <span className="text-sm font-medium text-gray-400 cursor-pointer hover:underline">
              {booksReadCount}권
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
