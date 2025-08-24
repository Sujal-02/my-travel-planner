"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Wand2,
  LoaderCircle,
  Plane,
  MapPin,
  UtensilsCrossed,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  DollarSign,
  Clock,
  Star,
} from "lucide-react";

// TypeScript Types
interface DiningOption {
  name: string;
  meal: string;
  estimated_cost_usd: string;
}
interface Day {
  day: number;
  title: string;
  summary: string;
  attractions: string[];
  dining: DiningOption[];
}
interface ItineraryData {
  city: string;
  budget: string;
  total_days: number;
  itinerary: Day[];
}

export default function HomePage() {
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [days, setDays] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, budget, days: parseInt(days) }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate itinerary.");
      }
      const data: ItineraryData = await response.json();
      setItinerary(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const ItinerarySkeleton = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-80 mx-auto" />
        <div className="flex justify-center gap-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-px w-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  
  const ErrorDisplay = ({ message }: { message: string }) => (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Something went wrong
        </CardTitle>
        <CardDescription className="text-destructive/80">
          {message}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button 
          variant="outline" 
          onClick={() => setError(null)}
          className="w-full"
        >
          Try Again
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
        <div className="relative">
          <div className="container mx-auto px-4 pt-16 pb-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                <Star className="h-4 w-4" />
                AI-Powered Travel Planning
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Plan Your Perfect Trip
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Create personalized itineraries with AI. Just tell us where you want to go, your budget, and how long you'll stay.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 pb-16">
        {/* Form Section */}
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">Start Planning</CardTitle>
            <CardDescription className="text-base">
              Tell us about your dream destination
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  Destination
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="city" 
                    placeholder="Tokyo, Paris, New York..." 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    className="pl-10 h-12"
                    required 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget" className="text-sm font-medium">
                    Total Budget
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="budget" 
                      placeholder="e.g., $1500" 
                      value={budget} 
                      onChange={(e) => setBudget(e.target.value)} 
                      className="pl-10 h-12"
                      required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="days" className="text-sm font-medium">
                    Trip Duration
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="days" 
                      type="number" 
                      min="1" 
                      max="14" 
                      placeholder="Days (1-14)" 
                      value={days} 
                      onChange={(e) => setDays(e.target.value)} 
                      className="pl-10 h-12"
                      required 
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> 
                    Creating your itinerary...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" /> 
                    Generate My Itinerary
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {(loading || error || itinerary) && (
          <div className="w-full max-w-4xl mx-auto mt-16">
            <div className="mb-8">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            
            {loading && <ItinerarySkeleton />}
            {error && <ErrorDisplay message={error} />}
            
            {itinerary && (
              <div className="space-y-8">
                {/* Trip Overview */}
                <div className="text-center space-y-4">
                  <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    Your {itinerary.city} Adventure
                  </h2>
                  <div className="flex justify-center flex-wrap gap-3">
                    <Badge variant="secondary" className="px-3 py-1">
                      <Calendar className="mr-1 h-4 w-4" />
                      {itinerary.total_days} {itinerary.total_days === 1 ? 'Day' : 'Days'}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <DollarSign className="mr-1 h-4 w-4" />
                      {itinerary.budget}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1">
                      <MapPin className="mr-1 h-4 w-4" />
                      {itinerary.city}
                    </Badge>
                  </div>
                </div>

                {/* Daily Itinerary */}
                <div className="space-y-6">
                  {itinerary.itinerary.map((day, index) => (
                    <Card key={day.day} className="relative overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                {day.day}
                              </div>
                              <CardTitle className="text-xl lg:text-2xl">
                                {day.title}
                              </CardTitle>
                            </div>
                            <CardDescription className="text-base leading-relaxed pl-10">
                              {day.summary}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6 pt-2">
                        {/* Attractions Section */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            Places to Visit
                          </h4>
                          <div className="grid gap-3 pl-10">
                            {day.attractions.map((attraction, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm leading-relaxed">{attraction}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Dining Section */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                              <UtensilsCrossed className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                            </div>
                            Where to Eat
                          </h4>
                          <div className="grid gap-3 pl-10">
                            {day.dining.map((dining, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
                                <div className="flex items-center gap-3">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <span className="font-medium text-sm">{dining.meal}</span>
                                    <p className="text-sm text-muted-foreground">{dining.name}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {dining.estimated_cost_usd}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Footer CTA */}
                <Card className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="text-center py-8">
                    <h3 className="text-xl font-semibold mb-2">Ready for another adventure?</h3>
                    <p className="text-muted-foreground mb-4">Generate a new itinerary for your next destination</p>
                    <Button 
                      onClick={() => {
                        setItinerary(null);
                        setCity('');
                        setBudget('');
                        setDays('');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      variant="outline"
                    >
                      Plan Another Trip
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}