import { Hero } from "@/components/hero";
import { Offers } from "@/components/hero/offers";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Offers />
    </main>
  );
}
