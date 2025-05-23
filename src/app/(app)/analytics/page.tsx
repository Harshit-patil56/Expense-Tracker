import { SpendingBarChart } from "@/components/features/analytics/spending-bar-chart";
import { SpendingPieChart } from "@/components/features/analytics/spending-pie-chart";
import { placeholderExpenses } from "@/lib/constants";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // client hook, so page needs to be client

// This page needs to be a client component if we use useToast directly here.
// Alternatively, the button action could be a server action.
// For simplicity, let's keep it as a server component and the button won't actually do anything.

export default function AnalyticsPage() {
  // const { toast } = useToast(); // This would make it a client component.
  
  const handleExportData = () => {
    // This would be a client-side function, or trigger a server action for export.
    // toast({ title: "Export Data", description: "This feature is coming soon!" });
    alert("Data export feature is coming soon!"); // Simple placeholder
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Visualize your spending habits and financial patterns.</p>
        </div>
        <Button variant="outline" onClick={handleExportData}> {/* onClick requires client component or server action */}
            <Download className="mr-2 h-4 w-4" />
            Export Data
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <SpendingBarChart expenses={placeholderExpenses} />
        <SpendingPieChart expenses={placeholderExpenses} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Insights Overview</CardTitle>
          <CardDescription>Summary of key financial metrics and trends.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold">Top Spending Category</h3>
                    <p className="text-primary text-xl">Food ($XXX.XX)</p> 
                    {/* TODO: Calculate this dynamically */}
                </div>
                <div>
                    <h3 className="font-semibold">Average Daily Spend</h3>
                    <p className="text-primary text-xl">$XX.XX</p>
                    {/* TODO: Calculate this dynamically */}
                </div>
                <div>
                    <h3 className="font-semibold">Most Frequent Expense</h3>
                    <p className="text-primary text-xl">Groceries</p>
                    {/* TODO: Calculate this dynamically */}
                </div>
                 <div>
                    <h3 className="font-semibold">Savings Rate</h3>
                    <p className="text-accent-foreground text-xl">XX%</p>
                    {/* TODO: Calculate this dynamically based on income */}
                </div>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
                More detailed reports and custom date range filtering will be available soon.
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
