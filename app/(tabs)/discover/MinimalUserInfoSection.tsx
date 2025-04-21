import Image from "next/image";

// Define the shape of the minimal user data prop
interface MinimalUser {
  name: string;
  imageUrl: string;
}

// Define the props for the minimal component
interface MinimalUserInfoSectionProps {
  user: MinimalUser;
}

// Define the MinimalUserInfoSection component
export default function MinimalUserInfoSection({
  user,
}: MinimalUserInfoSectionProps) {
  return (
    <section className="">
      {" "}
      {/* Reduced margin */}
      <div className="flex items-center space-x-3">
        {" "}
        {/* Reduced space */}
        {/* Profile Image */}
        <div className="relative w-10 h-10 flex-shrink-0">
          <Image
            src={user.imageUrl}
            alt={`${user.name}'s profile picture`}
            fill={true}
            className="rounded-full object-cover"
          />
        </div>
        {/* Text Content */}
        <div className="flex flex-col">
          {/* Name */}
          <h2 className="text-base font-medium text-white">
            {" "}
            {/* Adjusted heading level and style */}
            {user.name}
          </h2>
        </div>
      </div>
    </section>
  );
}
