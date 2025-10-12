export default function Head() {
  return (
    <>
      {/* DNS 预解析 */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      
      {/* 预连接 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* 资源提示 */}
      <link rel="preload" as="image" href="/favicon.svg" type="image/svg+xml" />
    </>
  );
}
