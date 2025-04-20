import React from "react";
import Image from "next/image";

// --- Interfaces (copied from page.tsx or defined locally if preferred) ---
interface UserProfile {
  profile_id: string;
  name: string;
  imageUrl: string;
  bio?: string;
}

interface ConnectionInfo {
  degree: number;
  path: UserProfile[];
}

interface CommonBookDetail {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
}

interface CommonBooksInfo {
  books: CommonBookDetail[];
}
// -----------------------------------------------------------------------

// --- Dummy Data for Own Profile Demo ---
const dummyFriendProfile: UserProfile = {
  profile_id: "dummy-friend",
  name: "가상 친구",
  imageUrl: "/profiles/profile-placeholder.png", // Replace with a real placeholder if you have one
};

const dummyConnectionInfo: ConnectionInfo = {
  degree: 1,
  path: [], // Path only includes intermediate users, so empty for degree 1
};
// -------------------------------------

interface UserRelationSectionProps {
  viewingUser: UserProfile;
  targetUser: UserProfile;
  connectionInfo?: ConnectionInfo; // Make optional
  commonBooksInfo?: CommonBooksInfo; // Make optional
}

const UserRelationSection: React.FC<UserRelationSectionProps> = ({
  viewingUser,
  targetUser,
  connectionInfo: providedConnectionInfo, // Rename prop to avoid conflict
  commonBooksInfo,
}) => {
  // --- Use Dummy Data if on own profile and no real connection data --- START
  let connectionInfo = providedConnectionInfo;
  const isOwnProfile = viewingUser.profile_id === targetUser.profile_id;

  if (isOwnProfile && !connectionInfo) {
    // Use dummy data only if on own profile and no connection info is provided
    connectionInfo = dummyConnectionInfo;
    // Adjust targetUser for the dummy display
    targetUser = dummyFriendProfile;
  }
  // --- Use Dummy Data if on own profile and no real connection data --- END

  const hasConnection = !!connectionInfo;
  const hasCommonBooks = !!commonBooksInfo && commonBooksInfo.books?.length > 0;

  // Render nothing if neither section has data (after potential dummy data check)
  if (!hasConnection && !hasCommonBooks) {
    return null;
  }

  return (
    // Main container for the combined section
    <div className="mt-8 px-4 py-4 border border-gray-700 rounded-lg bg-gray-900 mb-12">
      {/* --- Connection Path Sub-section --- */}
      {hasConnection && connectionInfo && (
        <div
          className={hasCommonBooks ? "pb-4 mb-4 border-b border-gray-700" : ""}
        >
          {/* Modify title for dummy data case */}
          <h3 className="text-sm font-semibold text-gray-400 mb-4">
            {isOwnProfile && connectionInfo.degree === 1
              ? `${viewingUser.name}님과 ${targetUser.name}님은 ${connectionInfo.degree}촌 관계입니다. (예시)`
              : `${viewingUser.name}님과 ${targetUser.name}님은 ${connectionInfo.degree}촌 관계입니다.`}
          </h3>
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 overflow-x-auto pb-2">
            {/* Viewing User */}
            <div className="flex flex-col items-center text-center flex-shrink-0 w-16 sm:w-20">
              <Image
                src={viewingUser.imageUrl}
                alt={viewingUser.name}
                width={48}
                height={48}
                className="rounded-full border-2 border-blue-500"
              />
              <span className="mt-1 text-xs truncate w-full">
                {viewingUser.name} (나)
              </span>
            </div>
            {/* Intermediate Users or Arrow for Degree 1 */}
            {connectionInfo.path.length > 0 ? (
              connectionInfo.path.map((user) => (
                <React.Fragment key={user.profile_id}>
                  <div className="text-gray-500 text-xl font-light flex-shrink-0 mx-1 sm:mx-2">
                    →
                  </div>
                  <div className="flex flex-col items-center text-center flex-shrink-0 w-16 sm:w-20">
                    <Image
                      src={user.imageUrl}
                      alt={user.name}
                      width={48}
                      height={48}
                      className="rounded-full border-2 border-gray-500"
                    />
                    <span className="mt-1 text-xs truncate w-full">
                      {user.name}
                    </span>
                  </div>
                </React.Fragment>
              ))
            ) : (
              // Show arrow directly for degree 1 connections (including dummy)
              <div className="text-gray-500 text-xl font-light flex-shrink-0 mx-1 sm:mx-2">
                →
              </div>
            )}

            {/* Target User - Could be real or dummy */}
            <div className="flex flex-col items-center text-center flex-shrink-0 w-16 sm:w-20">
              <Image
                src={targetUser.imageUrl} // Uses potentially overridden targetUser
                alt={targetUser.name} // Uses potentially overridden targetUser
                width={48}
                height={48}
                className="rounded-full border-2 border-green-500"
              />
              <span className="mt-1 text-xs truncate w-full">
                {targetUser.name} // Uses potentially overridden targetUser
              </span>
            </div>
          </div>
        </div>
      )}

      {/* --- Common Books Sub-section --- */}
      {hasCommonBooks && commonBooksInfo && (
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-4">
            함께 읽은 책
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-3 gap-y-4">
            {commonBooksInfo.books.map((book) => (
              <div
                key={book.id}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-1.5 flex-shrink-0">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={60}
                    height={84}
                    className="rounded object-cover shadow-md"
                    unoptimized
                  />
                </div>
                <p className="text-xs font-medium text-white leading-tight line-clamp-2 mb-0.5 w-full">
                  {book.title}
                </p>
                <p className="text-[11px] text-gray-400 leading-tight line-clamp-1 w-full">
                  {book.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRelationSection;
