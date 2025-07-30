import Account from "@/components/account/Account";
import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const AccountPage = () => {
  return (
    <div>
      <Account />
    </div>
  );
};

export default AccountPage;
