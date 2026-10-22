"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"; 
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useVerifyAccount, useResendOTP } from "@/hooks"; 
import { Input } from "../ui/input";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  otp: z.string().length(6, "Enter a 6-digit code"),
});

type FormValues = z.infer<typeof schema>;

export function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") ?? "";
 
  const [countdown, setCountdown] = useState(0);

  const { mutate: verifyEmail, isPending: isLoading } = useVerifyAccount();
  const { mutate: resendOTP, isPending: isResending } = useResendOTP(); 

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });
 
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 2000);
    return () => clearTimeout(timer);
  }, [countdown]);

  async function onSubmit(values: FormValues) {
    const payload = {
      email: values.email.trim().toLowerCase(),
      otp: values.otp.trim(),
    };

    verifyEmail(payload, {
      onSuccess: () => {
        toast.success("Email verified", {
          description: `You're in, ${payload.email}.`,
        });
        router.replace("/dashboard");
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Verification failed. Please try again.";
        toast.error("Verification failed", { description: message });
      },
    });
  }

  function handleResend() {
    const email = form.getValues("email").trim().toLowerCase();
    
    if (!email || form.formState.errors.email) {
      toast.error("Invalid email", { description: "Please enter a valid email address first." });
      return;
    }

    resendOTP({ email }, {
      onSuccess: () => {
        toast.success("Code resent", { description: "Check your inbox for a new verification code." });
        setCountdown(60); // Lock button for 60 seconds
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Failed to resend code.";
        toast.error("Resend failed", { description: message });
      },
    });
  }

  return (
    <Card className="border-border w-full max-w-md mx-auto">
      <CardHeader className="sr-only">
        <h2>Verify email form</h2>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            {/* Email Field */}
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                readOnly={Boolean(emailParam)}
                {...form.register("email")}
              />
              <FieldError errors={form.formState.errors.email ? [form.formState.errors.email] : []} />
            </Field>

            {/* shadcn Input OTP Field using Controller */}
            <Field className="flex flex-col items-center gap-2">
              <FieldLabel htmlFor="otp" className="self-start">Verification code</FieldLabel>
              <Controller
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <InputOTP
                    id="otp"
                    maxLength={6}
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
              <FieldError errors={form.formState.errors.otp ? [form.formState.errors.otp] : []} />
            </Field>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying…" : "Verify and continue"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center border-t border-border pt-3 text-center text-xs text-muted-foreground gap-2">
        <p>The code expires shortly.</p>
        <div className="flex items-center gap-1">
          <span>Didn't receive it?</span>
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-xs"
            disabled={countdown > 0 || isResending}
            onClick={handleResend}
          >
            {countdown > 0 ? `Resend in ${countdown}s` : isResending ? "Sending..." : "Resend OTP"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
