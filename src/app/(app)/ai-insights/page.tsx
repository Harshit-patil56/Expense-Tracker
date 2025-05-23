
import { InsightsForm } from "@/components/features/ai-insights/insights-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AiInsightsPage() {
  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">AI-Powered Financial Guidance</h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            Let Expense Tracker analyze your habits and goals to provide actionable budgeting tips, helping you navigate your financial journey with confidence.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl">Get Personalized Tips</CardTitle>
                        <CardDescription>
                        Share some details about your spending and financial aspirations, and our AI will generate tailored advice for you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <InsightsForm />
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-1 space-y-6">
                <Card className="bg-primary/5">
                    <CardContent className="p-6">
                        <Image 
                            src="https://placehold.co/600x400.png" 
                            alt="AI Financial Advisor" 
                            width={600} 
                            height={400} 
                            className="rounded-lg mb-4 shadow-md" 
                        />
                        <h3 className="text-lg font-semibold text-primary mb-2">How It Works</h3>
                        <p className="text-sm text-muted-foreground">
                            Our advanced AI model processes the information you provide to identify patterns and suggest effective strategies. Your data is handled securely and used solely for generating your personalized tips.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Example Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>💡 "Consider allocating 15% of your discretionary spending towards your emergency fund."</p>
                        <p>💡 "Try the 'envelope system' for your grocery budget to curb overspending."</p>
                        <p>💡 "Review your subscriptions monthly and cancel any you no longer use frequently."</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}

