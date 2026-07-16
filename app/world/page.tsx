import { withBasePath } from "../runtime-paths";
import { WorldShell } from "./world-shell";

const worldCharacters = [
  {
    index: "01",
    name: "TOJI",
    image: "/toji/world/toji.png",
    imageClassName: "is-toji",
  },
  {
    index: "02",
    name: "RIN",
    image: "/toji/world/rin-display.png",
    imageClassName: "is-rin",
  },
  {
    index: "03",
    name: "JANE",
    image: "/toji/world/jane-display.png",
    imageClassName: "is-jane",
  },
  {
    index: "04",
    name: "THE MAN",
    image: null,
    imageClassName: "is-the-man",
  },
] as const;

export default function WorldPage() {
  return (
    <WorldShell destination="world">
      <section className="world-characters-hero" aria-labelledby="world-title">
        <p>WORLD / CHARACTERS</p>
        <h1 id="world-title">THE OUTSIDER</h1>
      </section>

      <div className="world-characters" aria-label="THE OUTSIDER characters">
        {worldCharacters.map((character, index) => (
          <section
            className={`world-character reveal-section${
              index % 2 === 1 ? " is-reversed" : ""
            }`}
            key={character.name}
          >
            <div className={`world-character__art ${character.imageClassName}`}>
              <div className="world-character__art-depth">
                {character.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`${character.name} character artwork`}
                    className="world-character__image"
                    loading={index === 0 ? "eager" : "lazy"}
                    src={withBasePath(character.image)}
                  />
                ) : (
                  <span className="world-character__unknown" aria-label="Artwork withheld">
                    ?
                  </span>
                )}
              </div>
            </div>

            <div className="world-character__identity">
              <span>CHARACTER {character.index}</span>
              <h2>{character.name}</h2>
              <i aria-hidden="true" />
            </div>
          </section>
        ))}
      </div>
    </WorldShell>
  );
}
