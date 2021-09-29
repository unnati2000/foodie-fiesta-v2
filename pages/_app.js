import axios from "axios";
import { useState } from "react";
import { redirectUser } from "../utils/auth.utils";
import Layout from "../components/layout/Layout.component";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "react-query";
import { parseCookies, destroyCookie } from "nookies";
import "react-toastify/dist/ReactToastify.css";
import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }) => {
  const { token } = parseCookies(ctx);

  let pageProps = {};

  const protectedRoutes = ctx.pathname === "/post/create";

  const availableForEveryone =
    ctx.pathname === "/" || ctx.pathname === "/[username]";

  if (!token) {
    destroyCookie(ctx, "token");

    protectedRoutes && redirectUser(ctx, "/auth");
  } else {
    try {
      const res = await axios.get(`http://localhost:3000/api/auth`, {
        headers: { Authorization: token },
      });
      const { user } = res.data;

      if (user && !availableForEveryone) {
        !protectedRoutes && redirectUser(ctx, "/");
      }
      pageProps.user = user;
    } catch (err) {
      console.error(err);
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/auth");
    }
  }

  return { pageProps };
};
export default MyApp;
