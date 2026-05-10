import { prisma } from "@/lib/prisma";
import MessagesManager from "./MessagesManager";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MessagesManager initialMessages={messages} />;
}
