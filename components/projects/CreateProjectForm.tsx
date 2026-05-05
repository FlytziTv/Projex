"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  InputGroup,
  InputGroupInput,
  InputGroupLabel,
  InputGroupTextarea,
} from "../ui/MyInput";

export function CreateProjectForm({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      const token = localStorage.getItem("projex_token")?.replace(/"/g, "");

      const response = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });

      if (response.ok) {
        router.refresh();
        onSuccess(); // seulement en cas de succès
      } else {
        alert("Erreur lors de la création du projet");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <InputGroup>
        <InputGroupLabel>Project Name</InputGroupLabel>
        <InputGroupInput
          type="text"
          placeholder="Name of the project"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
      </InputGroup>

      <InputGroup>
        <InputGroupLabel>Description</InputGroupLabel>
        <InputGroupTextarea
          name="notes"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of the project..."
          disabled={isLoading}
          rows={4}
        />
      </InputGroup>

      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-transparent hover:bg-foreground/10 border text-foreground font-medium py-2 px-6 rounded-md transition-colors duration-200 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-foreground hover:bg-foreground/70 text-background font-medium py-2 px-6 rounded-md transition-colors disabled:cursor-not-allowed disabled:bg-foreground/50 disabled:opacity-50 duration-200 cursor-pointer"
        >
          Add Project
        </button>
      </div>
    </form>
  );
}
