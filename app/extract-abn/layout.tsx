import { Toaster } from "@/components/ui/sonner";

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="p-4">{children}
     <Toaster />
  </div>;
}
export default Layout;
