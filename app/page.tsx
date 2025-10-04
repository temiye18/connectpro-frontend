import { Video } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 bg-[#1a1f2e]">
      <main className="flex flex-col items-center text-center max-w-2xl">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 mb-16">
          <Video className="w-14 h-14 text-blue-500" strokeWidth={2} />
          <h1 className="text-4xl font-bold text-white">ConnectPro</h1>
        </div>

        {/* Hero Section */}
        <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Start your video
          <br />
          meeting in seconds
        </h2>

        <p className="text-xl text-gray-300 mb-12">
          No downloads. No hassle. Just connect.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            variant="primary"
            size="lg"
            href="/signin"
            fullWidth
          >
            Sign In
          </Button>

          <Button
            variant="outline"
            size="lg"
            href="/guest-join"
            fullWidth
          >
            Start Meeting as Guest
          </Button>
        </div>
      </main>
    </div>
  );
}
