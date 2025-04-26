import Image from "next/image";

// Props for ProfileSm and ProfileMd
interface ProfileBaseProps {
  imageUrl: string;
  name: string;
  altText?: string; // Optional alt text, defaults to name's profile picture
}

// Props for ProfileLg, extends base props with bio
interface ProfileLgProps extends ProfileBaseProps {
  bio: string;
}

// Small Profile Component
export function ProfileSm({ imageUrl, name, altText }: ProfileBaseProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-8 h-8">
        {" "}
        {/* Small size: w-8 h-8 */}
        <Image
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

// Medium Profile Component
export function ProfileMd({ imageUrl, name, altText }: ProfileBaseProps) {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative w-16 h-16">
        {" "}
        {/* Medium size: w-16 h-16 */}
        <Image
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <span className="text-base font-semibold">{name}</span>
    </div>
  );
}

// Large Profile Component
export function ProfileLg({ imageUrl, name, bio, altText }: ProfileLgProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-32 h-32 mb-4">
        {" "}
        {/* Large size: w-32 h-32 */}
        <Image
          src={imageUrl}
          alt={altText ?? `${name}'s profile picture`}
          fill={true}
          className="rounded-full object-cover"
        />
      </div>
      <span className="text-xl font-semibold mb-2">{name}</span>
      <p className="text-sm text-gray-600 max-w-xs">{bio}</p> {/* Added bio */}
    </div>
  );
}
