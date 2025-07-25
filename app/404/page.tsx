"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="bg-card border-border rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center animate-scale-in">
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="text-8xl font-bold text-primary animate-pulse">404</div>
            <h1 className="text-3xl font-bold text-card-foreground">Page Not Found</h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved to another location.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-3">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-border text-card-foreground hover:bg-accent rounded-2xl px-6 py-3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">Need help finding something?</p>
            <Button variant="ghost" className="text-primary hover:bg-primary/10 rounded-2xl">
              <Search className="h-4 w-4 mr-2" />
              Search Documentation
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
