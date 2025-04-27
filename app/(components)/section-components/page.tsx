import { Section } from "@/components/section";
import { Soulline } from "@/components/soulline";
import data from "../../../data.json";
import { BookLg } from "@/components/book";

export default function SectionComponents() {
  return (
    <div className="max-w-[680px] mx-auto">
      <h1 className="text-3xl font-bold my-12 text-white">
        section components
      </h1>
      <div className="space-y-16">
        <Section title="기본 섹션">섹션 콘텐츠</Section>
        <Section title="소울라인">
          <Soulline profiles={data.profiles} />
        </Section>
        <Section title="함께 읽은 책">
          <div className="flex flex-row gap-6">
            {data.books.map((book) => (
              <BookLg
                key={book.id}
                imageUrl={book.imageUrl}
                title={book.title}
              />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
