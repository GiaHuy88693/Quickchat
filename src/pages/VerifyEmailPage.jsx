import React, { useState } from "react";
import api from "../lib/api";
import { toast } from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const email = new URLSearchParams(location.search).get("email");

  // Giới hạn chỉ nhập số & tối đa 6 ký tự
  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // loại bỏ chữ
    if (value.length <= 6) setOtp(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Verification code must be 6 digits.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/verify-otp", { email, otp });
      if (data.success) {
        toast.success("Email verified successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Verification failed.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      const { data } = await api.post("/api/auth/resend-otp", { email });
      if (data.success) {
        toast.success("Verification code has been resent!");
      } else {
        toast.error(data.message || "Unable to resend the code.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_center,_rgba(80,50,200,0.3),_black)]">
      <div className="bg-black/30 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-[380px] text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Verify Email</h2>
        <p className="text-sm text-gray-300 mb-6">
          A verification code has been sent to: <br />
          <span className="text-purple-400">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter 6-digit code"
            className="w-full text-center tracking-[6px] text-lg px-4 py-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition"
          >
            {loading ? "Verifying..." : "Verify Now"}
          </button>
        </form>

        <div className="mt-5 text-gray-400 text-sm">
          Didn’t receive the code?{" "}
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-purple-400 hover:text-purple-300 underline disabled:opacity-50"
          >
            {resending ? "Resending..." : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
