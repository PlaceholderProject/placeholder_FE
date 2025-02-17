import Script from "next/script";

export default function ScheduleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        type="text/javascript"
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`}
        strategy="beforeInteractive"
      />
      {children}
    </>
  );
}
