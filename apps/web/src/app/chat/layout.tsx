import { AuthProvider } from "@/components/auth/AuthProvider";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getMeFromSSR } from "@/lib/get-me";
import Image from "next/image";
import Link from "next/link";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getMeFromSSR();

  // Trường hợp hiếm (token hết hạn sau middleware): hiển thị fallback nhẹ
  const headerRight = user ? (
    <div className="flex items-center gap-3">
      {(() => {
        const fallbackSeed = encodeURIComponent(
          user.username || user.email || "User"
        );
        const avatarSrc =
          user.avatarUrl ||
          `https://api.dicebear.com/9.x/initials/svg?seed=${fallbackSeed}`;
        return (
          <Image
            src={avatarSrc}
            alt={user.username || "User"}
            width={28}
            height={28}
            className="rounded-full"
          />
        );
      })()}
      <span className="text-sm">{user.username ?? "User"}</span>
      <form action={"/api/auth/logout"} method="POST">
        <Button className="text-sm underline">Đăng xuất</Button>
      </form>
    </div>
  ) : (
    <div className="text-sm text-muted-foreground">Đang tải…</div>
  );

  return (
    <AuthProvider user={user}>
      <div className="grid grid-rows-[auto_1fr] min-h-svh">
        <header className="border-b px-6 py-3 flex items-center jiustify-between">
          <Link href={"/chat"} className="font-semibold">
            Realtime Chat
          </Link>
          {headerRight}
        </header>
        <main className="grid md:gird-cols-[280px_1fr]">
          {/* Sidebar placehodler */}
          <aside className="border-r p-4 hidden md:block">
            <div className="text-sm font-medium mb-2">Friends</div>
            <div className="text-sm text-muted-foreground">Comming soon...</div>
          </aside>
          <section className="p-4">{children}</section>
        </main>
      </div>
    </AuthProvider>
  );
}
