import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CalendarPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Calendar</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Phase 2 Calendar Module</CardTitle>
                    <CardDescription>Day, Week, and Month views will be added with task and deadline sync.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Current MVP includes tasks, goals, memory, agents, events, dashboard, and chat.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
