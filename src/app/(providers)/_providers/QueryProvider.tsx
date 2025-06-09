"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function QueryProvider({ children }: React.PropsWithChildren) {
  const queryClient = new QueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
export default QueryProvider;

// "use client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { useState } from "react";

// function QueryProvider({ children }: React.PropsWithChildren) {
//   // useState로 한 번만 생성되도록 함
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 60 * 1000, // 1분
//             gcTime: 5 * 60 * 1000, // 5분
//           },
//         },
//       }),
//   );

//   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
// }

// export default QueryProvider;
