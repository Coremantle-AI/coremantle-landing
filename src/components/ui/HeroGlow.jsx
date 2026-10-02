/** Soft lavender bloom rising from the bottom of a hero. */
export default function HeroGlow() {
  return (
    <div
      className="hero-glow absolute inset-[auto_0_0] h-[60%] pointer-events-none bg-[radial-gradient(60%_80%_at_50%_100%,rgba(139,147,232,.13),transparent_70%)]"
      aria-hidden="true"
    />
  );
}
