import AuthProvider from "./components/AuthProvider";
import "./globals.css";

export const metadata = {
  title: "Air Aviation Services",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
