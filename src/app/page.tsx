import { Feed } from "@/components/Feed";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen pt-12">
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-8">
        Echo
      </h1>
      <Feed />
    </div>
  );
}
