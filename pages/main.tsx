import { dummyGardens } from "@/components/app/garden-card";
import GardenCard from "@/components/app/garden-card";

export default function MainPage() {
  // 각 크기별로 하나씩 선택
  const smallCard = dummyGardens[0];
  const mediumCard = dummyGardens[1];
  const largeCard = dummyGardens[2];

  return (
    <div className="px-6 mt-2">
      <div className="flex flex-col gap-6">
        <h2 className="text-white text-2xl font-bold">크기 비교</h2>
        <div className="space-y-6">
          <GardenCard {...smallCard} size="small" />
          <GardenCard {...mediumCard} size="medium" />
          <GardenCard {...largeCard} size="large" />
        </div>
      </div>
    </div>
  );
}
