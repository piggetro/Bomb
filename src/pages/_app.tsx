import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster position="top-center" />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
