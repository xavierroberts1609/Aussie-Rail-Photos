import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    href: "/gallery",
    title: "Gallery",
    description: "Browse the full collection of Australian railway photography",
  },
  {
    href: "/photographers",
    title: "Photographers",
    description: "Explore photos by the community of contributors",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-ink-border">
        <Image
          src="/images/hero-banner.jpg"
          alt="Interstate locomotives hauling a passenger train across a bridge in Australia"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_68%]"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(109,138,115,0.12),transparent_60%)]" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-28 text-center">
          <h1 className="font-display text-5xl leading-tight text-bone sm:text-6xl">
            Aussie
            <br />
            <span className="text-gold">Rail Photos</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-bone-muted">
            The home of Australian railway photography
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-20">
        <div className="grid gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group panel flex flex-col justify-between p-8 transition-colors hover:border-gold/60"
            >
              <div>
                <h2 className="font-display text-2xl text-bone group-hover:text-gold">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm text-bone-muted">{card.description}</p>
              </div>
              <span className="mt-6 text-sm font-semibold text-gold">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
