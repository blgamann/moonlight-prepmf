import localFont from "next/font/local";

export const gurmukhiMN = localFont({
  src: [
    {
      path: "../public/fonts/GurmukhiMN.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/GurmukhiMN-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-gurmukhi-mn",
});

export const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/Helvetica.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Helvetica-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-helvetica",
});

export const nanumMyeongjo = localFont({
  src: [
    {
      path: "../public/fonts/NanumMyeongjo.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumMyeongjo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-nanum-myeongjo",
});
