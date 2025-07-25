"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { RefreshCw, Home, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function ServerErrorPage() {

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="bg-card border-border rounded-3xl p-12 shadow-2xl max-w-2xl w-full text-center animate-scale-in">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="p-6 rounded-full bg-red-500/20 border border-red-500/30">
                                <AlertTriangle className="h-16 w-16 text-red-400" />
                            </div>
                        </div>
                        <div className="text-6xl font-bold text-red-400">500</div>
                        <h1 className="text-3xl font-bold text-card-foreground">Server Error</h1>
                        <p className="text-muted-foreground text-lg max-w-md mx-auto">
                            Something went wrong on our end. We're working to fix this issue. Please try again later.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => window.location.reload()}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 py-3"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="border-border text-card-foreground hover:bg-accent rounded-2xl px-6 py-3 bg-transparent"
                        >
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Go Home
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-4">
                            If this problem persists, please contact our support team.
                        </p>
                        <Button variant="ghost" className="text-primary hover:bg-primary/10 rounded-2xl">
                            Contact Support
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}
