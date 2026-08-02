import { Container } from "@/components/ui/Container";

type Props = {
  label: string;
  items: { id: string; label: string }[];
};

/**
 * Sticky in-page navigation. Plain anchors, no JavaScript; `scroll-padding-top`
 * in globals.css keeps targets clear of this bar.
 */
export function SectionNav({ label, items }: Props) {
  return (
    <nav
      aria-label={label}
      className="border-line sticky top-0 z-30 border-b bg-white/95 backdrop-blur"
    >
      <Container>
        <ul className="-mx-1 flex gap-1 overflow-x-auto py-2">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-primary-700 hover:bg-primary-50 block rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors sm:text-sm"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
