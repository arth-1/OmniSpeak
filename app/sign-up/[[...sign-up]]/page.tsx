import { SignUp } from "@clerk/nextjs";



export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <SignUp appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-card shadow-lg rounded-lg",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-muted-foreground",
            formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
            formFieldInput: "bg-background border-input",
            footerActionLink: "text-primary hover:text-primary/90",
          }
        }} />
      </div>
    </div>
  );
}