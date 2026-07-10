import AuthLayout from "@/components/auth/AuthLayout";
import Signup from "@/components/auth/Signup";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const SignupPage = () => {
  return (
    <AuthLayout mode="signup">
      <Signup />
    </AuthLayout>
  );
};

export default SignupPage;
