import { Link, useLocation } from "react-router-dom";

function PaymentResult() {
//   const location = useLocation();
//   const success = location.state?.success;

  const location = useLocation();
const { success, amount, reference } = location.state || {};

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-3">
          {success ? "Payment Successful!" : "Payment Status"}
        </h1>

        <p className="mb-6">
          {success
            ? "Thank you for supporting our campaign."
            : "Your payment could not be verified. Please check your donation history."}
        </p>

        <Link
          to="/donor/history"
          className="bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          View Donation History
        </Link>
      </div>
    </div>
  );
}

export default PaymentResult;