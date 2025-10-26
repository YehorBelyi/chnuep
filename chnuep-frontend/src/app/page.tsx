import Image from "next/image";
import Header from "./components/header/header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-6 mt-[100px]">
        <h1 className="text-3xl font-bold">Welcome to MyCourse</h1>
        <p className="mt-4">This is a simple example of Ant Design + Tailwind header with TypeScript.</p>
      </main>
    </div>
  );
}
