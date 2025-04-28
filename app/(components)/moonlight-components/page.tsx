import React from "react";
import Link from "next/link";

const components = [
  "profile",
  "book",
  "answer",
  "soulline",
  "button",
  "item",
  "index-bar",
  "tabs",
  "section",
  "input",
  "label",
];

export default function Home() {
  return (
    <div className="max-w-[680px] mx-auto">
      <h1 className="text-3xl font-bold my-12 text-white">
        moonlight components
      </h1>
      <ul className="space-y-2">
        {components.map((name) => (
          <li key={name}>
            <div className="p-2">
              <Link
                href={`/${name}-components`}
                className="text-white text-xl font-medium hover:underline"
              >
                {name}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
