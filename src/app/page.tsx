export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <p className="label-eyebrow">GymTrack Pro</p>
        <h1 className="font-display text-title font-semibold tracking-tight text-text-primary">
          Instrument panel
        </h1>
        <p className="text-text-muted">
          Design tokens and type preview — Phase 2 foundation before feature
          screens.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-card border border-line bg-surface-1 p-4">
        <p className="label-eyebrow">Surfaces</p>
        <div className="grid grid-cols-3 gap-2">
          <Swatch name="surface-0" className="bg-surface-0" />
          <Swatch name="surface-1" className="bg-surface-1" />
          <Swatch name="surface-2" className="bg-surface-2" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Swatch name="volt" className="bg-volt text-on-volt" />
          <Swatch name="amber" className="bg-amber text-on-volt" />
          <Swatch name="ember" className="bg-ember text-on-volt" />
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface-1 p-4">
        <p className="label-eyebrow">Numerals (tabular)</p>
        <div className="flex items-end justify-between gap-4 border-l-4 border-volt pl-3">
          <div>
            <p className="label-eyebrow">Weight</p>
            <p className="font-display font-tabular text-numeral font-semibold leading-none text-text-primary">
              40.0
            </p>
          </div>
          <div>
            <p className="label-eyebrow">Reps</p>
            <p className="font-display font-tabular text-numeral font-semibold leading-none text-text-primary">
              8
            </p>
          </div>
        </div>
        <div className="rounded-control bg-surface-2 px-3 py-4 text-center">
          <p className="label-eyebrow text-amber">Rest</p>
          <p className="font-display font-tabular text-timer font-semibold leading-none text-amber">
            1:30
          </p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-control">
          <div className="hazard-stripe h-full w-1/3" aria-hidden />
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-card border border-line bg-surface-1 p-4">
        <p className="label-eyebrow">Type</p>
        <p className="font-display text-title font-semibold">Archivo — display</p>
        <p className="font-sans text-body text-text-muted">
          Instrument Sans — body copy stays at 16px so iOS does not zoom on
          focus. Labels use uppercase Archivo with tracking.
        </p>
      </section>
    </main>
  );
}

function Swatch({
  name,
  className,
}: {
  name: string;
  className: string;
}) {
  return (
    <div
      className={`flex h-16 flex-col justify-end rounded-control border border-line p-2 ${className}`}
    >
      <span className="font-display text-[10px] font-semibold uppercase tracking-wider">
        {name}
      </span>
    </div>
  );
}
