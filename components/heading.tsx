export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-2xl font-['NanumMyeongjo'] text-white/95">
      {children}
    </h1>
  );
}
