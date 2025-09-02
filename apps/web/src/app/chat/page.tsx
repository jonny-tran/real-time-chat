import { getMeFromSSR } from "@/lib/get-me";
import { redirect } from "next/navigation";

async function logout() {
  "use server";
  await fetch("/api/auth/logout", { method: "POST", cache: "no-store" });
  redirect("/login");
}

export default async function ChatPage() {
  const user = await getMeFromSSR();
  if (!user) redirect("/login");

  return (
    <main className="mx-auto max-w-xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Chat</h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập dưới danh tính: {user.username || user.email}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
          >
            Đăng xuất
          </button>
        </form>
      </header>

      <section className="rounded border p-4">
        <p className="text-sm">Email: {user.email}</p>
        {user.username && <p className="text-sm">Username: {user.username}</p>}
      </section>

      <section className="rounded border p-4">
        <p className="text-sm text-muted-foreground">
          Khu vực nhắn tin sẽ được triển khai sau.
        </p>
      </section>
    </main>
  );
}
