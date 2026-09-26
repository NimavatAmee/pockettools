import Link from "next/link";
import { Button } from "@/components/ui";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto text-2xl font-bold">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text">Tool Page Not Found</h1>
        <p className="text-sm text-text-secondary">
          The tool or page you are looking for doesn’t exist or has moved.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/">
          <Button variant="primary" className="gap-2 w-full sm:w-auto">
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Button>
        </Link>
        <Link href="/calculators">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <Search className="w-4 h-4" />
            <span>Browse All Tools</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
