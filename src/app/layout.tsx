import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Placement-Alarm",
  description: "A platform to help students track and manage their placement process effectively.",
   icons: {
    icon: "logo1.png", 
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <ClerkProvider 
      appearance={{
        baseTheme: shadesOfPurple,
        variables: { colorPrimary: '#FFB200', colorTextOnPrimaryBackground:'black', colorInputBackground:"#B7C9F2" , colorInputText:"#071952" ,borderRadius:"0.675rem" },
      }}
    >
      <html lang="en">
        <body
          suppressHydrationWarning
          className="antialiased min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 flex flex-col"
        >
         <ConvexClientProvider> {children} </ConvexClientProvider>
            <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "8px",
              background: "#C0C9EE",
              color: "#090040",
            },
          }}
        />
        </body>
      </html>
    </ClerkProvider>
  );
}
