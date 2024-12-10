"use client";

const CognitoForm = () => {
  return (
    <div className="p-4" style={{ overflow: "hidden" }}>
      {/* Embedded Cognito Form using iframe */}
      <iframe
        src="https://www.cognitoforms.com/f/EKmVxlM-lU29YZL6o1MZCw/1"
        allow="payment"
        style={{
          border: 0,
          width: "100%",
          height: "1124px",
          overflowX: "hidden",
        }}
        title="Cognito Form"
        scrolling="no" // Prevents the iframe scrollbar
      ></iframe>
      <script src="https://www.cognitoforms.com/f/iframe.js"></script>
    </div>
  );
};
export default CognitoForm;
