import { PageProps } from "@/lib/types";
import { unstable_setRequestLocale } from "next-intl/server";
import { Opening } from "./_components";

export default async function Home({ params }: PageProps<{ locale: string }>) {
  unstable_setRequestLocale(params.locale);

  return <Opening />;
}
