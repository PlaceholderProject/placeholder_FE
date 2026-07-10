import AuthLayout from "@/components/auth/AuthLayout";
import Login from "@/components/auth/Login";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const LoginPage = () => {
  return (
    <AuthLayout mode="login">
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;
