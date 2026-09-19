import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

function AuthShell({ eyebrow, title, description, children, footer }) {
  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#171714] lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden min-h-screen overflow-hidden lg:block">
        <img
          src="/home8.jpg"
          alt="Rastah collection"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/25" />
        <Link
          to="/"
          className="absolute left-10 top-9 flex items-center gap-2 text-sm tracking-[0.18em] text-white"
        >
          <ArrowLeft size={17} /> BACK TO STORE
        </Link>
        <div className="absolute bottom-12 left-12 max-w-lg text-white">
          <p className="mb-4 text-xs tracking-[0.35em] text-white/70">THE RASTAH WORLD</p>
          <h2 className="font-serif text-5xl leading-[1.05]">Craft, culture, and clothing made to live in.</h2>
        </div>
      </section>

      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-16 xl:px-24">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-[0.22em]">RASTAH</Link>
          <Link to="/" className="flex items-center gap-2 text-xs tracking-[0.15em] lg:hidden">
            <ArrowLeft size={15} /> STORE
          </Link>
        </div>

        <div className="my-auto w-full max-w-md self-center py-12">
          <p className="mb-3 text-xs font-medium tracking-[0.28em] text-[#777268]">{eyebrow}</p>
          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#6d685f]">{description}</p>
          <div className="mt-9">{children}</div>
          <div className="mt-8 text-sm text-[#6d685f]">{footer}</div>
        </div>

        <p className="text-center text-[11px] tracking-[0.15em] text-[#8c877d]">
          SECURE ACCOUNT ACCESS · STYLECOM
        </p>
      </section>
    </main>
  );
}

export default AuthShell;
