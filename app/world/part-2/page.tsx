import { createRouteMetadata } from "../../site-url";
import { WorldShell } from "../world-shell";

export const metadata = createRouteMetadata({
  title: "PART II | THE OUTSIDER | TOJI",
  description: "THE OUTSIDER PART II coordinate archive.",
  pathname: "/world/part-2",
});

export default function PartTwoPage() {
  return (
    <WorldShell destination="part-2">
      <section className="future-archive" aria-labelledby="future-archive-title">
        <p>THE OUTSIDER</p>
        <h1 id="future-archive-title">PART II</h1>
        <i aria-hidden="true" />
        <strong>ARCHIVE NOT OPEN</strong>
      </section>
    </WorldShell>
  );
}
