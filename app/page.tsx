import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "moonlight - 관계가 피어나는 달빛 정원",
  description:
    "책을 통해 나를 찾고, 사람들과 연결되는 공간. 함께할수록 더욱 깊어지는 독서의 여정.",
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black">
      <div className="min-h-screen grid grid-cols-[1.2fr_0.8fr] relative max-lg:flex max-lg:flex-col max-lg:justify-center max-lg:gap-8 max-lg:py-24">
        {/* Logo at the top */}
        <a
          href="#"
          className="absolute top-8 right-16 z-10 flex items-center no-underline max-lg:right-8"
        >
          {/* <Image
            src="/logo.svg"
            alt="moonlight Logo"
            className="mr-2"
            width={40}
            height={40}
          /> */}
          <span className="font-['GurmukhiMN'] text-[#38d4e7] text-[1.5rem] tracking-[-0.2px]">
            moonlight
          </span>
        </a>

        {/* Left Content */}
        <div className="p-16 flex flex-col justify-center bg-zinc-950 relative overflow-hidden max-lg:items-center max-lg:text-center max-lg:px-8 max-lg:pt-8 max-lg:pb-0">
          <h1 className="text-[4.5rem] max-lg:text-[3rem] leading-[1.2] font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-[#6ABECF] via-white to-[#6ABECF] bg-clip-text text-transparent inline-block">
              관계가 피어나는
            </span>
            <br />
            달빛 정원
          </h1>

          <p className="text-2xl text-[#999] max-w-[600px] mb-8">
            책을 통해 나를 찾고, 사람들과 연결되세요
          </p>

          {/* Features Grid - Hide on mobile */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 my-12 max-lg:hidden">
            <div className="bg-white/5 p-6 rounded-md border border-white/10">
              <h3 className="text-[#6ABECF] mb-2 text-[1.2rem] font-bold">
                질문이 피어나는 공간
              </h3>
              <p className="text-[#999] text-[0.95rem]">
                한 권의 책에서 다양한 질문과 대화가 피어납니다.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-md border border-white/10">
              <h3 className="text-[#6ABECF] mb-2 text-[1.2rem] font-bold">
                무한한 해석의 공유
              </h3>
              <p className="text-[#999] text-[0.95rem]">
                새로운 관점을 발견하고, 마음을 확장하는 특별한 순간
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-md border border-white/10">
              <h3 className="text-[#6ABECF] mb-2 text-[1.2rem] font-bold">
                소울 메이트와의 만남
              </h3>
              <p className="text-[#999] text-[0.95rem]">
                서로의 마음이 통할 때 소울링크가 생성됩니다.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-md border border-white/10">
              <h3 className="text-[#6ABECF] mb-2 text-[1.2rem] font-bold">
                작가님을 위한 공간
              </h3>
              <p className="text-[#999] text-[0.95rem]">
                독자들과 함께 이야기가 펼쳐지는 질문의 정원을 가꿔보세요.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Show on mobile */}
        <div className="bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/garden-bg.jpg')] bg-cover bg-center relative flex items-center justify-center">
          {/* Auth Container */}
          <div className="bg-white/10 backdrop-blur-[10px] p-10 rounded-md border border-white/20 w-[90%] max-w-[400px] text-white">
            {/* Auth Form */}
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  id="email"
                  placeholder="이메일 또는 전화번호"
                  required
                  className="px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6ABECF] focus:bg-white/15"
                />
              </div>
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  id="password"
                  placeholder="비밀번호"
                  required
                  className="px-4 py-3 rounded-md border border-white/20 bg-white/10 text-white text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6ABECF] focus:bg-white/15"
                />
              </div>
              <Link href="/discover" passHref>
                <button
                  type="button"
                  className="mt-4 p-3 border-none rounded-md bg-[#4A9DAF] text-white text-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#5FA8B9] hover:-translate-y-0.5 w-full"
                >
                  로그인
                </button>
              </Link>
              <div className="text-center text-[0.9rem] text-white/60">
                <a
                  href="#"
                  className="text-[#6ABECF] no-underline hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </a>
                {/* Divider */}
                <div className="h-px bg-white/20 my-4"></div>
                <span className="mt-2 inline-block">
                  아직 계정이 없으신가요?{" "}
                  <a
                    href="#"
                    className="text-[#6ABECF] no-underline hover:underline"
                  >
                    새 계정 만들기
                  </a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
