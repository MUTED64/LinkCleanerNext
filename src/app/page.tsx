import UrlCleanerApp from '@/components/app';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <>
      <UrlCleanerApp />
      <Toaster position="top-right" />
    </>
  );
}