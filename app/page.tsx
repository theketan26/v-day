import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, Sparkles, Lock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <header className="border-b border-pink-100 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
              Romantic Apps
            </span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-romantic text-white hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8 animate-slide-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-700">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Create Magic, Share Love</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-romantic bg-clip-text text-transparent">
              Create Beautiful Romantic Experiences
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Design personalized romantic apps using our curated templates. Share them with your loved ones with beautiful animations and custom touches.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gradient-romantic text-white hover:opacity-90 px-8">
                Create Your First App
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-pink-200 px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16 pt-16 border-t border-pink-100">
            <div className="space-y-3 p-6 rounded-lg bg-white border border-pink-100 hover:shadow-lg transition-shadow">
              <Sparkles className="w-8 h-8 text-pink-500 mx-auto" />
              <h3 className="font-semibold text-lg">5 Beautiful Templates</h3>
              <p className="text-gray-600 text-sm">Choose from stunning romantic templates, each with custom animations and personalization options.</p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-white border border-pink-100 hover:shadow-lg transition-shadow">
              <Heart className="w-8 h-8 text-pink-500 mx-auto fill-pink-500" />
              <h3 className="font-semibold text-lg">Fully Customizable</h3>
              <p className="text-gray-600 text-sm">Personalize colors, text, images, and animations to match your unique love story.</p>
            </div>

            <div className="space-y-3 p-6 rounded-lg bg-white border border-pink-100 hover:shadow-lg transition-shadow">
              <Lock className="w-8 h-8 text-pink-500 mx-auto" />
              <h3 className="font-semibold text-lg">Passkey Protected</h3>
              <p className="text-gray-600 text-sm">Share your creation with a unique passkey. Only those you invite can access your romantic app.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pink-100 bg-white/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600 text-sm">
          <p>Create beautiful moments, share with love. © 2025 Romantic Apps</p>
        </div>
      </footer>
    </div>
  )
}
