import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/discover",
  "/garden",
  "/garden/vegan",
  "/soullink",
  "/notification",
  "/profile",
  "/collection",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/soullink/someone",
  "/garden/vegan/answer",
  "/garden/vegan/write-answer",
  "/garden/vegan/question-suggest",
]);

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === "/") {
    const discoverUrl = new URL("/discover", req.url);
    return NextResponse.redirect(discoverUrl);
  }

  if (!isPublicRoute(req)) {
    auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
