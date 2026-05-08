"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GitHubIcon } from "@/components/icons/GitHub";
import { Logo } from "@/components/icons/logo";
import {
  InputGroup,
  InputGroupInput,
  InputGroupLabel,
} from "@/components/ui/MyInput";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // On réinitialise l'erreur à chaque tentative

    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Si tout s'est bien passé, on le renvoie vers la page de connexion
      router.push("/login");
    } catch (err) {
      console.error(err);

      // On vérifie proprement le type de l'erreur
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Une erreur inattendue est survenue");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className=" max-w-lg w-full flex flex-col items-center gap-6 ">
        <div className="w-full flex flex-col items-center justify-center gap-1.5">
          <Logo size={60} />
          <h1 className="text-xl font-bold">Welcome to Projex</h1>
          <p className="text-sm leading-normal font-normal text-muted-foreground ">
            Already have an account?{" "}
            <a
              href="/login"
              className="underline hover:text-primary transition-colors duration-500"
            >
              Log in
            </a>
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium text-center w-full bg-red-500/10 p-2 rounded">
            {error}
          </p>
        )}

        <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
          <InputGroup>
            <InputGroupLabel htmlFor="name">Name</InputGroupLabel>
            <InputGroupInput
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <InputGroupLabel htmlFor="email">Email</InputGroupLabel>
            <InputGroupInput
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <InputGroupLabel htmlFor="password">Password</InputGroupLabel>
            <InputGroupInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputGroup>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-foreground text-background h-9 text-sm flex flex-row items-center justify-center gap-2 font-medium rounded-md cursor-pointer hover:bg-foreground/70 transition-all duration-500 active:scale-98 "
            >
              Create Account
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
