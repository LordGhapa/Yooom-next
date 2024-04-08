import StreamVideoProvider from "@/providers/StreamClientProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zoom Clone",
  description: "app de Chamada de video",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
}
