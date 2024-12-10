import AuthProvider from "./components/AuthProvider";
import Layout from "./components/Layout";
import "./globals.css";

export const metadata = {
  title: "Air Aviation Services",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
        {/* <script
          src="https://www.cognitoforms.com/f/seamless.js"
          async
          data-key="EKmVxlM-lU29YZL6o1MZCw"
          data-form="1"
        ></script> */}
      <body>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
