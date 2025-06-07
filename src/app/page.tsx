import UrlCleanerApp from '@/components/UrlCleanerApp';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <>
      <UrlCleanerApp />
      <Toaster position="top-right" />
    </>
  );
}