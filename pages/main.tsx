export default function MainPage() {
  return (
    <main className="px-8">
      <h1 className="text-2xl font-bold text-white">App Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">최근 활동</h2>
          <p className="mt-2 text-white/60">아직 활동 내역이 없습니다.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">인기 정원</h2>
          <p className="mt-2 text-white/60">인기 정원을 확인해보세요.</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white">내 정원</h2>
          <p className="mt-2 text-white/60">아직 생성한 정원이 없습니다.</p>
        </div>
      </div>
    </main>
  );
}
