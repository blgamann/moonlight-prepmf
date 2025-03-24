import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100dvh-64px)]">
      <SignIn />
    </div>
  );
}
