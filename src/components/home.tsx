import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Palette, Code, Layers } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Cockpit Design System</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A comprehensive design system for building consistent, accessible user interfaces.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/foundations">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/components">View Components</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <Palette className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Foundations</CardTitle>
              <CardDescription>
                Core design principles, color systems, typography, and spacing guidelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="link" className="p-0">
                <Link to="/foundations">Explore Foundations →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Layers className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Components</CardTitle>
              <CardDescription>
                Reusable UI components built with React and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="link" className="p-0">
                <Link to="/components">View Components →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Code Examples</CardTitle>
              <CardDescription>
                Copy-paste ready code snippets with React, Tailwind, and design tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="link" className="p-0">
                <Link to="/components">Browse Examples →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Comprehensive guides, patterns, and best practices for your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="link" className="p-0">
                <Link to="/home">Read Docs →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}