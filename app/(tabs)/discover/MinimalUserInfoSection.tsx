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
        <Image
          src={user.imageUrl}
          alt={`${user.name}'s profile picture`}
          width={40} // Smaller image
          height={40} // Smaller image
          className="rounded-full flex-shrink-0"
        />
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
