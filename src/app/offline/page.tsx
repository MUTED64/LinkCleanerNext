export default function Offline() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">离线模式</h1>
        <p className="text-muted-foreground mb-6">
          您当前处于离线状态，但您仍然可以使用已缓存的功能。
        </p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✓ 链接清洗功能正常可用</p>
          <p>✓ 本地处理，无需网络</p>
          <p>✓ 数据安全可靠</p>
        </div>
      </div>
    </div>
  );
}
