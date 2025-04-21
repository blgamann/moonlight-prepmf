import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "moonlight - 관계가 피어나는 달빛 정원",
  description:
    "책을 통해 나를 찾고, 사람들과 연결되는 공간. 함께할수록 더욱 깊어지는 독서의 여정.",
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-black">
      <div className="min-h-screen grid grid-cols-[1.2fr_0.8fr] max-lg:grid-cols-1 relative">
        {/* Logo at the top */}
        <a
          href="#"
          className="absolute top-8 right-16 z-10 flex items-center no-underline max-lg:right-8"
        >
          <Image
            src="/logo.svg"
            alt="moonlight Logo"
            className="mr-2.5"
            width={40}
            height={40}
          />
          <span className="font-['Nunito'] text-[#6dd1e4] text-[1.5rem] font-bold tracking-[-0.2px]">
            moonlight
          </span>
        </a>

        {/* Left Content */}
        <div className="p-16 max-lg:p-8 flex flex-col justify-center bg-zinc-950 relative overflow-hidden">
          <h1 className="text-[4.5rem] max-lg:text-[3rem] leading-[1.2] font-extrabold text-white mb-4">
            <span className="bg-gradient-to-r from-[#6dd1e4] via-white to-[#6dd1e4] bg-clip-text text-transparent inline-block">
              관계가 피어나는
            </span>
            <br />
            달빛 정원
          </h1>

          <p className="text-2xl text-[#999] max-w-[600px] mb-8">
            책을 통해 나를 찾고, 사람들과 연결되세요
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 my-12">
            <div className="bg-white/5 p-6 rounded-[15px] border border-white/10">
              <h3 className="text-[#6dd1e4] mb-2 text-[1.2rem] font-bold">
                질문이 피어나는 공간
              </h3>
              <p className="text-[#888] text-[0.95rem]">
                한 권의 책에서 다양한 질문과 대화가 피어납니다.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-[15px] border border-white/10">
              <h3 className="text-[#6dd1e4] mb-2 text-[1.2rem] font-bold">
                무한한 해석의 공유
              </h3>
              <p className="text-[#888] text-[0.95rem]">
                새로운 관점을 발견하고, 마음을 확장하는 특별한 순간
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-[15px] border border-white/10">
              <h3 className="text-[#6dd1e4] mb-2 text-[1.2rem] font-bold">
                소울 메이트와의 만남
              </h3>
              <p className="text-[#888] text-[0.95rem]">
                서로의 마음이 통할 때 소울링크가 생성됩니다.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-[15px] border border-white/10">
              <h3 className="text-[#6dd1e4] mb-2 text-[1.2rem] font-bold">
                작가님을 위한 공간
              </h3>
              <p className="text-[#888] text-[0.95rem]">
                독자들과 함께 이야기가 펼쳐지는 질문의 정원을 가꿔보세요.
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Updated to match landing.html */}
        <div className="bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/garden-bg.jpg')] bg-cover bg-center relative flex items-center justify-center max-lg:hidden">
          {/* Auth Container */}
          <div className="bg-white/10 backdrop-blur-[10px] p-10 rounded-[20px] border border-white/20 w-[90%] max-w-[400px] text-white">
            {/* Auth Tabs */}
            <div className="flex mb-8 border-b border-white/20">
              <div className="auth-tab active px-4 py-2 text-[1.1rem] text-white cursor-pointer relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-[#6dd1e4]">
                로그인
              </div>
              <div className="auth-tab px-4 py-2 text-[1.1rem] text-white/60 cursor-pointer relative transition-all duration-300 ease-in-out hover:text-white">
                회원가입
              </div>
            </div>
            {/* Auth Form */}
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-white/80 text-[0.9rem]">
                  이메일
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="이메일을 입력하세요"
                  required
                  className="px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6dd1e4] focus:bg-white/15"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-white/80 text-[0.9rem]"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white text-base transition-all duration-300 ease-in-out focus:outline-none focus:border-[#6dd1e4] focus:bg-white/15"
                />
              </div>
              <button
                type="submit"
                className="mt-4 p-4 border-none rounded-lg bg-[#6dd1e4] text-white font-bold text-base cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#5bb3c4] hover:-translate-y-0.5"
              >
                로그인
              </button>
              <div className="mt-6 text-center text-[0.9rem] text-white/60">
                <a
                  href="#"
                  className="text-[#6dd1e4] no-underline hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </a>
                <br />
                <span className="mt-2 inline-block">
                  아직 계정이 없으신가요?{" "}
                  <a
                    href="#"
                    className="text-[#6dd1e4] no-underline hover:underline"
                  >
                    회원가입
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
