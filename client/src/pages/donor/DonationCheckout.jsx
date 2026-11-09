
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  createDonationOrder,
  verifyDonationPayment,
} from "../../services/donationService";

const amounts = [500, 1000, 2000, 5000];

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export default function DonationCheckout() {
  const { campaignId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState(1000);
  const [frequency, setFrequency] = useState("ONE_TIME");
  const [donorName, setDonorName] = useState(user?.name || "");
  const [donorPan, setDonorPan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!Number.isFinite(Number(amount)) || Number(amount) < 1) {
      setError("Enter a valid donation amount.");
      return;
    }

    if (donorPan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(donorPan)) {
      setError("Enter a valid PAN.");
      return;
    }

    setLoading(true);

    try {
      const loaded = await loadRazorpay();

      if (!loaded) {
        throw new Error("Unable to load Razorpay Checkout. Check your connection.");
      }

      const order = await createDonationOrder({
        campaignId,
        amount: Number(amount),
        frequency,
        donorName: donorName.trim(),
        donorPan: donorPan.toUpperCase(),
      });

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "NGO Donation Platform",
        description: "Support women's health and livelihoods",
        order_id: order.orderId,
        prefill: {
          name: donorName,
          email: user?.email || "",
        },
        theme: {
          color: "#065f46",
        },
        handler: async (response) => {
          try {
            await verifyDonationPayment({
              donationId: order.donationId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            navigate("/donor/payment-result", {
              state: {
                success: true,
                amount: Number(amount),
                reference: response.razorpay_payment_id,
              },
            });
          } catch (err) {
            setError(
              err.response?.data?.message ||
              "Payment verification failed. Please contact support."
            );
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", (response) => {
        setError(
          response.error?.description || "Payment failed. Please try again."
        );
        setLoading(false);
      });

      checkout.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Unable to start payment.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F3] px-4 py-12">
      <div className="max-w-xl mx-auto bg-white border border-stone-200 rounded-2xl p-6 md:p-8">
        <Link to={`/campaigns/${campaignId}`} className="text-emerald-800 text-sm">
          ← Back to campaign
        </Link>

        <h1 className="text-3xl font-bold text-stone-900 mt-5">
          Make a donation
        </h1>
        <p className="text-stone-600 mt-2">
          Support women's health and livelihood initiatives.
        </p>

        {error && (
          <p role="alert" className="bg-red-50 text-red-700 rounded-lg p-3 mt-5">
            {error}
          </p>
        )}

        <form onSubmit={handlePayment} className="space-y-5 mt-7">
          <div>
            <label className="block font-medium mb-2">Choose amount (₹)</label>
            <div className="grid grid-cols-4 gap-2">
              {amounts.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setAmount(value)}
                  className={`rounded-lg border py-3 text-sm ${
                    Number(amount) === value
                      ? "bg-emerald-800 text-white border-emerald-800"
                      : "border-stone-300"
                  }`}
                >
                  ₹{value}
                </button>
              ))}
            </div>

            <input
              type="number"
              min="1"
              max="1000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full border border-stone-300 rounded-lg p-3 mt-3"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Frequency</label>
            <div className="grid grid-cols-2 gap-3">
              {["ONE_TIME", "MONTHLY"].map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setFrequency(value)}
                  className={`rounded-lg border p-3 ${
                    frequency === value
                      ? "bg-emerald-50 border-emerald-700"
                      : "border-stone-300"
                  }`}
                >
                  {value === "ONE_TIME" ? "One-time" : "Monthly"}
                </button>
              ))}
            </div>
            <p className="text-xs text-stone-500 mt-2">
              Monthly is currently a recorded preference, not an automatic recurring charge.
            </p>
          </div>

          <div>
            <label htmlFor="donorName" className="block font-medium mb-2">
              Donor name
            </label>
            <input
              id="donorName"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              className="w-full border border-stone-300 rounded-lg p-3"
            />
          </div>

          <div>
            <label htmlFor="donorPan" className="block font-medium mb-2">
              PAN (optional)
            </label>
            <input
              id="donorPan"
              value={donorPan}
              onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
              maxLength={10}
              className="w-full border border-stone-300 rounded-lg p-3 uppercase"
              placeholder="ABCDE1234F"
            />
          </div>

          <p className="text-xs text-stone-500">
            You will be redirected to Razorpay's secure test checkout.
            No real money will be collected.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg p-3 disabled:opacity-50"
          >
            {loading ? "Opening payment..." : "Continue to payment"}
          </button>
        </form>
      </div>
    </main>
  );
}
