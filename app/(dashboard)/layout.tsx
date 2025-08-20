import { Sidebar } from "../../components/Sidebar";
import { AuthGuard } from "../../components/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto min-w-0">
          <div className="pt-16 md:pt-0">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
