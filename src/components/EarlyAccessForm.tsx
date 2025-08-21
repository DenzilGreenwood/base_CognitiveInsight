"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { LeadInput } from "@/app/actions";
import { createLead } from "@/app/actions";
import { toast } from "sonner";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

type Values = z.infer<typeof Schema>;

export default function EarlyAccessForm({
  defaultSource = "landing",
  onDone,
}: {
  defaultSource?: string;
  onDone?: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [pending, start] = useTransition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(Schema),
    defaultValues: { source: defaultSource },
  });

  async function onSubmit(values: Values) {
    start(async () => {
      const res = await createLead(values as LeadInput);
      if (res.ok) {
        toast("Thanks! We’ll be in touch.");
        reset();
        setOpen(false);
        onDone?.();
      } else {
        toast.error(res.error ?? "Something went wrong");
        console.error(res);
      }
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold mb-2">Request Early Access</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tell us a bit about you. We’ll reach out with next steps.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="text-sm">Name</label>
            <input {...register("name")} className="w-full rounded-lg border p-2" />
            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="text-sm">Email</label>
            <input {...register("email")} className="w-full rounded-lg border p-2" />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm">Company (optional)</label>
            <input {...register("company")} className="w-full rounded-lg border p-2" />
          </div>

          <div>
            <label className="text-sm">Notes (optional)</label>
            <textarea {...register("notes")} className="w-full rounded-lg border p-2 h-24" />
          </div>

          <input type="hidden" {...register("source")} value={defaultSource} />

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border px-3 py-2"
              disabled={pending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
              disabled={pending}
            >
              {pending ? "Submitting…" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
