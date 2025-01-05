import AuthProvider from "./components/AuthProvider";
import Layout from "./components/Layout";
import { FormProvider } from "./context/FormContext";
import "./globals.css";

export const metadata = {
  title: "Air Aviation Services",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <FormProvider>
            <Layout>{children}</Layout>
          </FormProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
