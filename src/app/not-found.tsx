import Link from "next/link";
import { Button } from "@heroui/react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <h1 className="text-8xl font-extrabold text-blue-800 tracking-tight">
        404
      </h1>
      <h2 className="text-2xl font-semibold text-slate-700 text-center">
        Oops! Page Not Found
      </h2>
      <p className="text-slate-500 text-center max-w-md">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary" size="lg" >
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;