export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-cream/30">
            {children}
        </div>
    )
}
