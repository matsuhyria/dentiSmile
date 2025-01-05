import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AppointmentsLoading() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </CardContent>
        </Card>
    )
}
