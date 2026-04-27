import Image from "next/image";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  image: string;
  date: Date;
  slug: string;
};

export default function AtmosphereCard({
  title,
  description,
  image,
  date,
  slug,
}: Props) {
  return (
    <article className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-950 hover:border-white/25 transition-all duration-300 flex flex-col">
      <div className="relative w-full aspect-[4/3] bg-zinc-900 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h2 className="font-bold text-sm text-white leading-snug mb-2 line-clamp-2">
          {title}
        </h2>
        <p className="text-white/45 text-xs leading-relaxed mb-4 line-clamp-4 flex-1">
          {description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-white/35 text-xs">
            {new Date(date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <Link
            href={`/atmosphere/${slug}`}
            className="text-white/60 text-xs font-medium hover:text-white transition">
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
}
