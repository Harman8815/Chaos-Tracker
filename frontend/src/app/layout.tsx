import type { Metadata } from "next";
import "./globals.css";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "Daily Tracker",
  description: "Track your daily habits and goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div id="loader">
          <svg className="pl" viewBox="0 0 240 240">
            <circle className="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="0 660" strokeDashoffset="-330" strokeLinecap="round"></circle>
            <circle className="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="0 220" strokeDashoffset="-110" strokeLinecap="round"></circle>
            <circle className="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round"></circle>
            <circle className="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="currentColor" strokeWidth="20" strokeDasharray="0 440" strokeLinecap="round"></circle>
          </svg>
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
