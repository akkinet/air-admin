import AuthProvider from "./components/AuthProvider";
import Layout from "./components/Layout";
import "./globals.css";

export const metadata = {
  title: "Air Aviation Services",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
