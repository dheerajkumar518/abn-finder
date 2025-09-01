import { CompaniesList } from "@/components/companies/CompaniesList";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar";

export default async function Home() {
  return (
    <div className="flex gap-4">
      <FiltersSidebar />
      <div className="flex-1">
        <CompaniesList />
      </div>
    </div>
  );
}
