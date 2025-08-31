import { CompaniesList } from "@/components/companies/CompaniesList";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-4 flex justify-between items-center gap-3">
        <h1 className="text-pretty text-xl font-semibold">Companies</h1>
        <ThemeToggle />
      </header>

      <div className="flex gap-4">
        <FiltersSidebar />
        <div className="flex-1">
          <CompaniesList />
        </div>
      </div>
    </main>
  );
}
