import { GitHubIcon } from "@/components/icons/GitHub";
import { Logo } from "@/components/icons/logo";
import {
  InputGroup,
  InputGroupInput,
  InputGroupLabel,
} from "@/components/ui/MyInput";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className=" max-w-lg w-full flex flex-col items-center gap-6 ">
        <div className="w-full flex flex-col items-center justify-center gap-1.5">
          <Logo size={60} />
          <h1 className="text-xl font-bold">Welcome to Projex</h1>
          <p className="text-sm leading-normal font-normal text-muted-foreground ">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="underline hover:text-primary transition-colors duration-500"
            >
              Register
            </a>
          </p>
        </div>

        <form className="w-full flex flex-col gap-6">
          <InputGroup>
            <InputGroupLabel htmlFor="email">Email</InputGroupLabel>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </InputGroup>

          <InputGroup>
            <div className="flex items-center justify-between w-full">
              <InputGroupLabel htmlFor="password">Password</InputGroupLabel>
              <a
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <InputGroupInput
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </InputGroup>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-foreground text-background h-9 text-sm flex flex-row items-center justify-center gap-2 font-medium rounded-md cursor-pointer hover:bg-foreground/70 transition-all duration-500 active:scale-98 "
            >
              Log in
            </button>

            <Separator />

            <button
              type="submit"
              className="w-full border border-border bg-muted/20 h-9 text-sm flex flex-row items-center justify-center gap-2 font-medium rounded-md cursor-pointer transition-all duration-500 hover:bg-muted/50 hover:text-foreground active:scale-98 "
            >
              <GitHubIcon size={16} />
              Continue with GitHub
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex items-center gap-3 w-full">
      <div className="h-px bg-muted flex-1" />
      <span className="text-sm text-muted-foreground">Or continue with</span>
      <div className="h-px bg-muted flex-1" />
    </div>
  );
}
