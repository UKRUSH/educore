// Forgot password page (stub — no email send implemented)

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forgot password</CardTitle>
        <p className="text-sm text-muted-foreground">
          Contact your administrator to reset your password.
        </p>
      </CardHeader>
      <CardContent>
        <Link href="/login">
          <Button variant="outline">Back to login</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
