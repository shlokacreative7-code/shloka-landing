import { audiences } from "@/content/home";
import { site } from "@/content/site";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DoodleField, type DoodleSpot } from "@/components/visuals/doodles";

const doodles: DoodleSpot[] = [
  { name: "home", x: "90%", y: "8%", size: 58, rotate: 8 },
  { name: "hands", x: "80%", y: "78%", size: 50, rotate: -8, delay: 3 },
  { name: "heartPulse", x: "2%", y: "70%", size: 44, rotate: 10, delay: 1.5 },
];

export function Why() {
  return (
    <section id="why" aria-labelledby="why-title" className="relative isolate bg-canvas-soft py-section">
      <DoodleField spots={doodles} className="text-ink/[0.07]" />
      <div className="container-x">
        <div className="grid gap-x-16 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <SectionHeading id="why-title" eyebrow={`Why ${site.name}`} title="Care shouldn’t depend on [luck.]" className="mb-6 lg:mb-16" />
          <Reveal delay={0.15} className="mb-12 sm:mb-16">
            <p className="text-lead">
              When someone you love needs help in a hurry, the usual options are an agency you’ve never heard of, a cash
              payment and a lot of hoping. There’s no proof anyone turned up and no record of what was done. {site.name}{" "}
              is the calmer way: a verified person by their side, and a clear record of every visit.
            </p>
          </Reveal>
        </div>

        {/* Arch-topped cards, echoing the logo. */}
        <div className="grid gap-6 md:grid-cols-3">
          {audiences.map(({ title, body, icon: Icon }, index) => (
            <Reveal key={title} delay={index * 0.1} y={40} className="h-full">
              <article className="group flex h-full flex-col items-center rounded-t-[14rem] rounded-b-3xl border border-line bg-card px-8 pt-14 pb-9 text-center transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-2 hover:border-gold/50 hover:shadow-card motion-reduce:hover:translate-y-0">
                <span
                  aria-hidden="true"
                  className="grid size-18 place-items-center rounded-full bg-navy text-gold ring-8 ring-canvas-soft transition-transform duration-500 ease-out-expo group-hover:scale-110 dark:bg-gold dark:text-navy"
                >
                  <Icon className="size-8" strokeWidth={1.5} />
                </span>
                <h3 className="mt-7 text-[1.375rem]">{title}</h3>
                <p className="mt-3">{body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
