import { prisma } from "@/lib/prisma";
import AboutManager from "./AboutManager";

export default async function AdminAboutPage() {
  const [content, values] = await Promise.all([
    prisma.aboutContent.findFirst(),
    prisma.aboutValue.findMany({ orderBy: { order: "asc" } }),
  ]);

  return <AboutManager initialContent={content} initialValues={values} />;
}
