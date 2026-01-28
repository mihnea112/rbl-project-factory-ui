'use client';

import { ArrowRight, Check, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="RBL Project Factory"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span className="font-semibold text-foreground text-lg">Project Factory OS</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/apply">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
          Build & scale{' '}
          <span className="bg-gradient-to-r from-[#002B7F] via-[#FCD116] to-[#CE1126] bg-clip-text text-transparent">
            Romania
          </span>
          {' '}s <span className="text-primary">highest-impact</span> entrepreneurial ecosystem
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto text-balance">
          We fund projects, not companies. Turning mission-aligned impact solutions into scaled, sustainable ventures across Romania's regions.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/apply">
            <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/projects">
            <Button size="lg" variant="outline">
              Explore Projects
            </Button>
          </Link>
        </div>
      </section>

      {/* Project Factory Lifecycle */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Project Factory Lifecycle</h2>
          <p className="text-lg text-muted-foreground">From selection through institutionalization, we support impact at every stage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stage: 'Selection', desc: 'Identify promising impact projects' },
            { stage: 'Incubation', desc: 'Build team and validate approach' },
            { stage: 'Chapter Pilot', desc: 'Test in local ecosystem' },
            { stage: 'Scale', desc: 'Replicate across regions' },
            { stage: 'Institutionalize', desc: 'Establish self-sustaining model' },
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="bg-card rounded-xl p-6 border border-border h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 mb-3" />
                <h3 className="font-semibold text-foreground mb-2">{item.stage}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              {idx < 4 && <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-border" />}
            </div>
          ))}
        </div>
      </section>

      {/* Core Rule */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12">
          <div className="flex gap-4 items-start">
            <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Core Rule: Projects, Not Companies</h3>
              <p className="text-lg text-foreground mb-4">
                We support mission-aligned impact solutions. Startups and businesses can participate, but only as implementation vehicles for achieving measurable impact—not for equity returns, growth capital, or exclusivity.
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Focus on social, environmental, or economic impact outcomes</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Open participation from diverse implementation teams</span>
                </li>
                <li className="flex gap-3 items-start">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">Transparent milestone and impact tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="bg-background py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">Eligibility Requirements</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border border-border rounded-xl p-6 bg-card">
              <h3 className="font-semibold text-foreground mb-4 text-lg flex gap-2 items-center">
                <Check className="w-5 h-5 text-primary" /> Your Project Should
              </h3>
              <ul className="space-y-3">
                <li className="text-foreground">✓ Solve a real, measurable impact challenge</li>
                <li className="text-foreground">✓ Have a clear theory of change</li>
                <li className="text-foreground">✓ Show market traction or strong validation</li>
                <li className="text-foreground">✓ Align with strategic objectives</li>
                <li className="text-foreground">✓ Have a committed implementation team</li>
              </ul>
            </div>

                <div className="border border-border rounded-xl p-6 bg-card">
              <h3 className="font-semibold text-foreground mb-4 text-lg flex gap-2 items-center">
                <TrendingUp className="w-5 h-5 text-primary" /> We Look For
              </h3>
              <ul className="space-y-3">
                <li className="text-foreground">✓ Scalability beyond initial pilot</li>
                <li className="text-foreground">✓ Financial sustainability pathway</li>
                <li className="text-foreground">✓ Ecosystem fit and partnership potential</li>
                <li className="text-foreground">✓ Risk awareness and mitigation plans</li>
                <li className="text-foreground">✓ Openness to mentorship and collaboration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-12 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Build Impact?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your application today and join a community of innovative problem solvers transforming Romania.
          </p>
          <Link href="/apply">
            <Button size="lg" className="bg-primary hover:bg-primary/90 gap-2">
              Start Application <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sidebar text-foreground border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary-foreground/20 flex items-center justify-center">
                  <span className="font-bold text-sm">RBL</span>
                </div>
                <span className="font-semibold">Project Factory OS</span>
              </div>
              <p className="text-sm opacity-75">Building Romania's impact ecosystem.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100">How it works</a></li>
                <li><a href="#" className="hover:opacity-100">For projects</a></li>
                <li><a href="#" className="hover:opacity-100">For supporters</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100">FAQ</a></li>
                <li><a href="#" className="hover:opacity-100">Documentation</a></li>
                <li><a href="#" className="hover:opacity-100">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 text-center text-sm opacity-75">
            <p>© 2025 RBL Project Factory. Building impact across Romania.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
