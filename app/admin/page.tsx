import { AdminStatistics } from '@/components/AdminStatistics';

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#1e3a8a] mb-6">Panel de Control General</h1>
      <AdminStatistics />
    </div>
  );
}
