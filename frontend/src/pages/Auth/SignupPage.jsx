import { SignUp } from "@clerk/clerk-react";

export default function SignupPage() {
  
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <SignUp
        path="/signup"
        signInUrl="/login"
        forceRedirectUrl="/select-role"
      />
    </div>
  );
}