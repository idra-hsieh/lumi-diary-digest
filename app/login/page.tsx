import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function page() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-primary text-center text-3xl">
            Log In
          </CardTitle>
        </CardHeader>

        <AuthForm type="login" />
      </Card>
    </div>
  );
}

export default page;
