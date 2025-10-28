import { ElegantLanding } from '@/components/ElegantLanding';

export function LandingPage() {
  return <ElegantLanding />;
}

export function OldLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-slate-900">Microdos.in</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Build Something
            <span className="text-primary block">Amazing</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Microdos.in is your production-ready full-stack starter project. 
            Get up and running with authentication, database, and beautiful UI in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything you need to get started
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Built with modern technologies and best practices for a seamless development experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription>
                Built with Vite and React for optimal performance and developer experience.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Production Ready</CardTitle>
              <CardDescription>
                Complete authentication, database setup, and deployment configuration included.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>
                TypeScript, Tailwind CSS, Prisma, and Passport.js for a robust foundation.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Loved by developers
            </h2>
            <p className="text-lg text-slate-600">
              See what others are saying about Microdos.in
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "This starter project saved me weeks of setup time. Everything just works out of the box!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Sarah Chen</p>
                    <p className="text-sm text-slate-500">Full Stack Developer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "The authentication system is rock solid and the UI components are beautiful."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Marcus Johnson</p>
                    <p className="text-sm text-slate-500">Startup Founder</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4">
                  "Perfect for rapid prototyping. I had a working app deployed in under an hour."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold text-slate-900">Alex Rodriguez</p>
                    <p className="text-sm text-slate-500">Product Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of developers who are building amazing things with Microdos.in
          </p>
          <Link to="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-slate-900">Microdos.in</span>
              </div>
              <p className="text-slate-600">
                Production-ready full-stack starter project for modern web applications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Product</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Features</a></li>
                <li><a href="#" className="hover:text-slate-900">Documentation</a></li>
                <li><a href="#" className="hover:text-slate-900">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Company</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-900">About</a></li>
                <li><a href="#" className="hover:text-slate-900">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#" className="hover:text-slate-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-slate-900">Impressum</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-slate-600">
            <p>&copy; 2024 Microdos.in. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
