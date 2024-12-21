"use client";

import { useEffect, useState } from "react";

const CognitoForm = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Ensuring that this component does'nt render on the server.
  }

  return (
    <>
      <iframe
        className=" w-full h-full p-4"
        src="https://www.cognitoforms.com/f/EKmVxlM-lU29YZL6o1MZCw/1"
        allow="payment"
        title="Cognito Form"
        data-cog-init="true"
      ></iframe>
      <script src="https://www.cognitoforms.com/f/iframe.js"></script>
    </>

  );
};

export default CognitoForm;
