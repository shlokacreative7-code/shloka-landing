import { faqs } from "@/content/faqs";
import { AnimatedHeadline } from "@/components/ui/animated-headline";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";

/** Native <details> accordion: keyboard and screen-reader friendly, and it opens smoothly where supported. */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-canvas py-section">
      <div className="container-x grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-32">
          <Reveal y={10}>
            <Eyebrow>FAQ</Eyebrow>
          </Reveal>
          <AnimatedHeadline id="faq-title" parts={[{ text: "Questions" }, { text: "families ask.", highlight: true }]} className="text-[clamp(2.5rem,5.4vw,4.5rem)]" />
          <Reveal delay={0.2}>
            <p className="mt-6">
              Something else on your mind? Ask us in the{" "}
              <a href="#enquire" className="font-semibold text-ink underline decoration-gold decoration-2 underline-offset-4">
                enquiry form
              </a>
              .
            </p>
          </Reveal>
        </div>

        <Reveal className="border-t border-line">
          {faqs.map((faq, index) => (
            <details key={faq.question} className="group border-b border-line">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-5 py-6 text-[1.1875rem] leading-snug font-bold text-ink [&::-webkit-details-marker]:hidden">
                <span aria-hidden="true" className="w-8 shrink-0 font-serif text-2xl font-normal text-gold">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{faq.question}</span>
                <span
                  aria-hidden="true"
                  className="relative size-10 shrink-0 rounded-full border border-line transition-colors duration-300 group-open:border-primary group-open:bg-primary group-hover:border-ink before:absolute before:top-1/2 before:left-1/2 before:h-0.5 before:w-3.5 before:-translate-1/2 before:rounded-full before:bg-ink group-open:before:bg-on-primary after:absolute after:top-1/2 after:left-1/2 after:h-3.5 after:w-0.5 after:-translate-1/2 after:rounded-full after:bg-ink after:transition-transform after:duration-300 group-open:after:scale-y-0"
                />
              </summary>
              <p className="pr-14 pb-7 pl-13">{faq.answer}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
