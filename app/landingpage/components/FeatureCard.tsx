import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Props {
    icon: React.ReactNode;
    title: string
    description: string
}

export function FeatureCard({ icon, title, description }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-col items-center">
                    {icon}
                    <span className="mt-4">{title}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-gray-600">{description}</p>
            </CardContent>
        </Card>
    )
}