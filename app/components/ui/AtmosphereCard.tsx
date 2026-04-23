import Image from "next/image";
import Link from "next/link";

type Props = {
  image: string;
  title: string;
  description: string;
  date: Date;
  slug: string;
};

export default function AtmosphereCard({
  image,
  title,
  description,
  date,
  slug,
}: Props) {
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col border border-white/20 rounded-2xl p-4 sm:p-5 bg-black hover:border-white/40 transition-colors duration-300">
      {/* Gambar */}
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover object-center"
        />
      </div>

      {/* Judul */}
      <h3 className="text-white font-bold text-base sm:text-lg leading-snug mb-3">
        {title}
      </h3>

      {/* Deskripsi */}
      <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">
        {description}
      </p>

      {/* Garis Pemisah */}
      <div className="border-t border-white/20 pt-3 flex items-center justify-between">
        <span className="text-white/50 text-xs italic">{formattedDate}</span>
        <Link
          href={`/atmosphere/${slug}`}
          className="text-white text-xs italic hover:opacity-60 transition-opacity duration-300">
          Read More
        </Link>
      </div>
    </div>
  );
}
