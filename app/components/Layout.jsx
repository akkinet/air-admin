"use client";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
// import nProgress from "nprogress";
import { useEffect } from "react";

function Layout({ children }) {
  const pathname = usePathname();

  // useEffect(() => {
  //   const handleStart = () => nProgress.start();
  //   const handleStop = () => nProgress.done();

  //   handleStart();
  //   const timeout = setTimeout(() => {
  //     handleStop();
  //   }, 1000); 

  //   return () => clearTimeout(timeout);
  // }, [pathname]);

  if (pathname === "/login") return <div>{children}</div>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 pl-2  flex flex-col h-[100vh]">
        <div className="flex-shrink-0">
          <Navbar />
        </div>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

    </div>
  );
}

export default Layout;
