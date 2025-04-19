import { FeatureCard } from "@/components/landing/FeatureCard";
import { StatCard } from "@/components/landing/StatCard";
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
            className="h-10 mr-2.5"
            width={40}
            height={40}
          />
          <span className="font-['Nunito'] text-[#6dd1e4] text-[1.5rem] font-bold tracking-[-0.2px]">
            moonlight
          </span>
        </a>

        {/* Left Content */}
        <div className="p-16 max-lg:p-8 flex flex-col justify-center bg-gradient-to-br from-black to-[#111] relative">
          <h1 className="text-[4.5rem] max-lg:text-[3rem] leading-[1.2] font-extrabold text-white mb-8">
            <span className="bg-gradient-to-r from-[#6dd1e4] via-white to-[#6dd1e4] bg-clip-text text-transparent inline-block">
              관계가 피어나는
            </span>
            <br />
            달빛 정원
          </h1>

          <p className="text-[1.25rem] text-[#999] max-w-[600px] mb-8">
            책을 통해 나를 찾고, 사람들과 연결되는 공간
            <br />
            함께할수록 더욱 깊어지는 독서의 여정
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 max-lg:grid-cols-1 gap-8 my-12">
            <FeatureCard
              title="질문이 피어나는 공간"
              description="한 권의 책에서 시작된 질문과 대화가 피어나는 곳입니다."
            />
            <FeatureCard
              title="무한한 해석의 공유"
              description="새로운 관점을 발견하고, 마음을 확장하는 특별한 순간"
            />
            <FeatureCard
              title="소울 메이트와의 만남"
              description="서로의 마음이 통할 때 소울링크가 생성됩니다."
            />
            <FeatureCard
              title="작가님을 위한 공간"
              description="독자들과 함께 이야기가 펼쳐지는 질문의 정원을 가꿔보세요."
            />
          </div>

          {/* Stats */}
          <div className="flex gap-12 mt-12 max-lg:gap-8 max-lg:flex-wrap">
            <StatCard value="3.5K+" label="활성 독자" className="text-white" />
            <StatCard value="250+" label="작가의 정원" className="text-white" />
            <StatCard value="15K+" label="공유된 생각" className="text-white" />
          </div>

          {/* CTA Button with hover animations as in landing.html */}
          <a
            href="/discover"
            className="cta-button group inline-flex items-center px-8 py-4 bg-[#6dd1e4] text-white font-bold rounded-full mt-8 transition-all hover:-translate-y-2 hover:shadow-lg hover:shadow-[#6dd1e4]/20"
          >
            가든 둘러보기
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-[5px]">
              →
            </span>
          </a>
        </div>

        {/* Right Content - Updated to match landing.html */}
        <div className="bg-[url('/garden-bg.jpg')] bg-cover bg-center relative max-lg:hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/30"></div>
          <div className="h-full flex items-center justify-center relative">
            <div className="floating-card w-4/5 bg-white/10 backdrop-blur-[10px] rounded-[20px] border border-white/20 p-8 transform translate-y-5 animate-[float_6s_ease-in-out_infinite]">
              <h3 className="text-[1.4rem] text-white mb-4">
                오늘의 추천 정원
              </h3>
              <p className="text-white/80 mb-2">김초엽 작가의 정원</p>
              <p className="text-white/60 text-[0.9rem]">
                &ldquo;우리가 빛의 속도로 갈 수 없다면&rdquo;에 대한
                <br />
                1,234개의 생각이 공유되었습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// 애니메이션을 위한 스타일은 globals.css에 다음을 추가해야 합니다:
// @keyframes float {
//   0%, 100% { transform: translateY(20px); }
//   50% { transform: translateY(0px); }
// }
