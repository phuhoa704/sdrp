import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
            <div className="text-center space-y-6 animate-fade-in">
                <h1 className="text-9xl font-display font-bold text-gradient">404</h1>
                <h2 className="text-3xl font-semibold text-dark-100">Page Not Found</h2>
                <p className="text-dark-400 max-w-md mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link href="/" className="inline-block btn-primary mt-8">
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
