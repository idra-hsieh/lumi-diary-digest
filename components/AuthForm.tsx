"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signupAction } from "@/actions/users";

type Props = {
  type: "login" | "signup"; // allows autocomplete for selection
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      let successMessage;

      if (isLoginForm) {
        const result = await loginAction(email, password);
        errorMessage = result.errorMessage;
        successMessage = "You have been successfully logged in.";
      } else {
        const result = await signupAction(email, password);
        errorMessage = result.errorMessage;
        successMessage = "Sign up successful — check your email.";
      }

      if (!errorMessage) {
        toast.success(successMessage);
        router.replace("/");
      } else {
        toast.error(errorMessage);
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="flex w-full flex-col items-stretch gap-2">
        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Log In"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p className="w-full text-center text-xs">
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}
          {"  "}
          <Link
            href={isLoginForm ? "/signup" : "/login"}
            className={`text-blue-500 underline ${
              isPending ? "pointer-events-none opacity-50" : ""
            }`}
          >
            {isLoginForm ? "Sign Up" : "Log In"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
