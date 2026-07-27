import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <h1 className="text-6xl font-bold font-mono text-accent">404</h1>
      <p className="text-sm text-secondary">The page you are looking for does not exist.</p>
      <Link
        href="/dashboard"
        className="text-xs font-semibold text-accent hover:underline"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
