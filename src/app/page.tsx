import Spline from '@splinetool/react-spline/next';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl w-full items-center">
        {/* Left: Text Content */}
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
            FUD Court
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-md">
            A sophisticated, data-driven dashboard designed to bring clarity to the chaotic world of cryptocurrency. Your all-in-one command center for market analysis, news, and deep-dives.
          </p>
          <Link
            href="https://discord.gg/Dh6CUWJ6bT"
            target="_blank"
            className="inline-block px-6 py-3 text-black font-semibold rounded-xl bg-yellow-300 hover:bg-yellow-400 transition"
          >
            Join Discord Community
          </Link>
        </div>

        {/* Right: Spline 3D Embed */}
        <div className="w-full aspect-square">
          <Spline scene="https://prod.spline.design/GJEG8QHAlHhazltR/scene.splinecode" />
        </div>
      </div>
    </main>
  );
}
