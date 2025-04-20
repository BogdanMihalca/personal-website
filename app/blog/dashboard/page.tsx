import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardContent } from "@/components/custom/dashboard-content";
import { GlitchText } from "@/components/custom/glitch-text";
import { DecoDivider } from "@/components/custom/deco-divider";

export default async function BlogDashboard() {
  const session = await auth();

  if (
    !session?.user ||
    !["AUTHOR", "EDITOR", "ADMIN"].includes(session.user.role)
  ) {
    redirect("/blog");
  }

  return (
    <div className="container mx-auto py-10 space-y-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="relative space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="relative">
              <GlitchText className="text-3xl">Blog Dashboard</GlitchText>
              <div className="absolute -inset-4 bg-purple-500/10 blur-xl rounded-lg -z-10"></div>
            </div>
          </div>
          <DecoDivider className="relative" />
        </div>
      </div>
      <DashboardContent
        userRole={session.user.role}
        userId={session.user.id!}
      />
    </div>
  );
}
