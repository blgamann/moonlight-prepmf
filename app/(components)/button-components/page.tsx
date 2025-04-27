"use client";

import { Button, ButtonDeep } from "@/components/button";

export default function ButtonPage() {
  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <h1>Button Tests</h1>
      <h2>Basic Button</h2>
      <Button>Click Me</Button>

      <h2 className="mt-4">Deep Press Button (Hold for 2s)</h2>
      <ButtonDeep />
    </div>
  );
}
