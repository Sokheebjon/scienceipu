import { Container } from "@/components/ui/Container";

type Props = {
  label: string;
  items: { id: string; label: string }[];
};

/**
 * Boxed dark in-page navigation, sticky under the fixed top nav. Plain
 * anchors, no JavaScript; `scroll-padding-top` in globals.css keeps targets
 * clear of both bars.
 */
export function SectionNav({ label, items }: Props) {
  return (
    <nav aria-label={label} className="sticky top-[72px] z-30 mb-5">
      <Container>
        <ul className="bg-primary-900 shadow-primary-950/40 flex gap-1 overflow-x-auto px-2 shadow-lg">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-primary-200 hover:bg-primary-950 block px-3 text-xs leading-[44px] font-semibold tracking-wide whitespace-nowrap uppercase transition-colors hover:text-white"
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
