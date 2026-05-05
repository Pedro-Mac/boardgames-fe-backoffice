"use client";

import { useActionState } from "react";
import type { GameOutput } from "@/types/games";

export type GameFormState = { error: string } | null;

type GameFormAction = (
  prevState: GameFormState,
  formData: FormData,
) => Promise<GameFormState>;

interface GameFormProps {
  formAction: GameFormAction;
  submitLabel: string;
  defaultValues?: Partial<GameOutput>;
}

const inputClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500";

/** "Create game" → "Creating…", "Save changes" → "Saving…" */
function toPendingLabel(label: string): string {
  const verb = label.split(" ")[0];
  const stem = verb.endsWith("e") ? verb.slice(0, -1) : verb;
  return `${stem}ing…`;
}

export default function GameForm({
  formAction,
  submitLabel,
  defaultValues,
}: Readonly<GameFormProps>) {
  const [state, action, isPending] = useActionState<GameFormState, FormData>(
    formAction,
    null,
  );

  return (
    <form action={action} className='flex flex-col gap-8'>
      {state?.error && (
        <div className='rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'>
          {state.error}
        </div>
      )}

      {/* Basic info */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>
          Basic info
        </h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='title'
              className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              Name <span className='text-red-500'>*</span>
            </label>
            <input
              id='title'
              name='title'
              type='text'
              required
              defaultValue={defaultValues?.title}
              className={inputClass}
              placeholder='Catan'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='publisher'
              className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              Publisher <span className='text-red-500'>*</span>
            </label>
            <input
              id='publisher'
              name='publisher'
              type='text'
              required
              defaultValue={defaultValues?.attribution?.publisher}
              className={inputClass}
              placeholder='Kosmos'
            />
          </div>
        </div>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='description'
            className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
          >
            Description <span className='text-red-500'>*</span>
          </label>
          <textarea
            id='description'
            name='description'
            required
            rows={4}
            defaultValue={defaultValues?.description}
            className={inputClass}
            placeholder='A brief description of the game…'
          />
        </div>
      </section>

      {/* Pricing & stock */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>
          Pricing &amp; stock
        </h2>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='price'
            className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
          >
            Price (€) <span className='text-red-500'>*</span>
          </label>
          <input
            id='price'
            name='price'
            type='number'
            required
            min='0'
            step='0.01'
            defaultValue={
              defaultValues?.commerce?.price !== undefined
                ? (defaultValues.commerce.price / 100).toFixed(2)
                : undefined
            }
            className={inputClass}
            placeholder='29.99'
          />
        </div>
      </section>

      {/* Players & play time */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>
          Players &amp; play time
        </h2>
        <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='min_players'
              className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              Min players <span className='text-red-500'>*</span>
            </label>
            <input
              id='min_players'
              name='min_players'
              type='number'
              required
              min='1'
              step='1'
              defaultValue={defaultValues?.gameplay?.players?.min}
              className={inputClass}
              placeholder='2'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='max_players'
              className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              Max players <span className='text-red-500'>*</span>
            </label>
            <input
              id='max_players'
              name='max_players'
              type='number'
              required
              min='1'
              step='1'
              defaultValue={defaultValues?.gameplay?.players?.max}
              className={inputClass}
              placeholder='4'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='min_play_time'
              className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              Min time (min) <span className='text-red-500'>*</span>
            </label>
            <input
              id='min_play_time'
              name='min_play_time'
              type='number'
              required
              min='1'
              step='1'
              defaultValue={defaultValues?.gameplay?.playtime?.min}
              className={inputClass}
              placeholder='60'
            />
          </div>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='max_play_time'
              className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
            >
              Max time (min) <span className='text-red-500'>*</span>
            </label>
            <input
              id='max_play_time'
              name='max_play_time'
              type='number'
              required
              min='1'
              step='1'
              defaultValue={defaultValues?.gameplay?.playtime?.max}
              className={inputClass}
              placeholder='120'
            />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>
          Details
        </h2>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='age_recommendation'
            className='text-sm font-medium text-zinc-700 dark:text-zinc-300'
          >
            Age recommendation <span className='text-red-500'>*</span>
          </label>
          <input
            id='age_recommendation'
            name='age_recommendation'
            type='number'
            required
            min='0'
            step='1'
            defaultValue={defaultValues?.gameplay?.minAge}
            className={inputClass}
            placeholder='10'
          />
        </div>
      </section>

      {/* Image URL — placeholder, upload not yet supported */}
      <section className='flex flex-col gap-4'>
        <h2 className='text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'>
          Image
        </h2>
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='image_url'
            className='text-sm font-medium text-zinc-400 dark:text-zinc-600'
          >
            Image URL{" "}
            <span className='ml-1 rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-normal text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'>
              coming soon
            </span>
          </label>
          {/* TODO: replace with file upload once image hosting is wired up */}
          <input
            id='image_url'
            name='image_url'
            type='url'
            disabled
            className='cursor-not-allowed rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-600'
            placeholder='Image upload not yet available'
          />
        </div>
      </section>

      {/* Actions */}
      <div className='flex items-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-700'>
        <button
          type='submit'
          disabled={isPending}
          className='rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200'
        >
          {isPending ? toPendingLabel(submitLabel) : submitLabel}
        </button>
        <a
          href='/backoffice/games'
          className='text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
