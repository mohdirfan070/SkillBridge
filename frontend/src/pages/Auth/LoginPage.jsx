import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex  flex-col justify-center items-center bg-gray-100">
      <SignIn 
        path="/login"
        routing="path"
        forceRedirectUrl={"/"}   
      />
    </div>
  );
}