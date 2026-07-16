import Link from "next/link";
import { WorldShell } from "./world/world-shell";

export default function NotFound() {
  return (
    <WorldShell>
      <section className="future-archive" aria-labelledby="not-found-title">
        <p>404 / COORDINATE NOT FOUND</p>
        <h1 id="not-found-title">NO RECORD</h1>
        <i aria-hidden="true" />
        <Link className="future-archive__link" href="/world">
          RETURN TO WORLD
        </Link>
      </section>
    </WorldShell>
  );
}
