"use client"
import AuthForm from "../../components/AuthForm";

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthForm isSignUp={true} />
    </div>
  );
}