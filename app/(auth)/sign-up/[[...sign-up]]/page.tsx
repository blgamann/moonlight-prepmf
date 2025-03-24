import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100dvh-64px)]">
      <SignUp />
    </div>
  );
}
