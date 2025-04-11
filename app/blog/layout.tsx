import { SideDisplay } from "@/components/custom/side-display";
import { Filter } from "lucide-react";
import BlogSidebar from "@/components/custom/blog-filers-sidebar";
import { getFilters } from "@/lib/db-utils";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { categories, tags } = await getFilters({ category: "" });

  return (
    <>
      <SideDisplay
        icon={<Filter width={30} height={30} />}
        title="Filters"
        theme="cyber"
        position="left"
        verticalPosition="top"
        verticalOffset={70}
        collapsedSize={40}
        width={420}
        hideOnDesktop={true}
      >
        <BlogSidebar categories={categories} tags={tags} />
      </SideDisplay>
      <main className="w-full h-full">{children}</main>
    </>
  );
}
