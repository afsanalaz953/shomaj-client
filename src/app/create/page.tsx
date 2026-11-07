"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  CalendarIcon,
  Image as ImageIcon,
  Loader2,
  Plus,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const EVENT_TYPES = [
  "Donation",
  "Workshop",
  "Cleanup",
  "Plantation",
 "Food Drive",
] as const;

type EventType = (typeof EVENT_TYPES)[number];

const EVENT_LOCATIONS = [
  "Uttara, Dhaka",
  "Badda, Dhaka",
  "Mohammadpur, Dhaka",
  "Mirpur, Dhaka",
  "Dhanmondi, Dhaka",
] as const;

interface EventFormState {
  title: string;
  type: EventType | null;
  date: Date | undefined;
  location: string;
  imageUrl: string;
  description: string;
}

const EMPTY_FORM: EventFormState = {
  title: "",
  type: null,
  date: undefined,
  location: "",
  imageUrl: "",
  description: "",
};

type FormErrors = Partial<Record<keyof EventFormState, string>>;

const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const validate = (form: EventFormState): FormErrors => {
  const errors: FormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Event title is required.";
  }

  if (!form.type) {
    errors.type = "Please pick an event type.";
  }

  if (!form.date) {
    errors.date = "Please pick an event date.";
  } else if (form.date.getTime() <= startOfToday().getTime()) {
    errors.date = "The event date must be in the future.";
  }

  if (!form.location.trim()) {
    errors.location = "Location is required.";
  }

  if (!form.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required.";
  } else if (!/^https?:\/\/\S+$/i.test(form.imageUrl.trim())) {
    errors.imageUrl = "Please enter a valid URL (https://...).";
  }

  if (!form.description.trim()) {
    errors.description = "Please add a short description.";
  }

  return errors;
};

const CreateEventPage = () => {
  const [form, setForm] = React.useState<EventFormState>(EMPTY_FORM);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [imageError, setImageError] = React.useState(false);
  const [dateOpen, setDateOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const patch = (partial: Partial<EventFormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const previewUrl = form.imageUrl.trim();
  const isValidImageUrl = /^https?:\/\/\S+$/i.test(previewUrl);

    const { data: session} = authClient.useSession();
    const user = session?.user;
    const userId = user?.id;
console.log (user, "user");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.add({
        type: "destructive",
        title: "Check the form",
        description: "Please fix the highlighted fields before submitting.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        category: form.type,
        date: form.date!.toISOString(),
        location: { venue: form.location.trim() },
        imageUrl: form.imageUrl.trim(),
        description: form.description.trim(),
        status: "upcoming",
        userName: user?.name,
        userId : user?.id,
        userEmail: user?.email,
        userImage: user?.image,
      };
      // Token added
    const { data:tokenData} = await authClient.token(); 
console.log(tokenData, "create Event Token")

    if (!userId || !tokenData?.token) {
  toast.error("Please login first");
  return;
}

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/create`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            authorization:`Bearer ${tokenData.token}`
          },
          body: JSON.stringify(payload),
        }
      );
//       const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/tutors`, {
//            method: 'POST',
//         headers: {
//             'content-type': 'application/json'
//            },
//            body: JSON.stringify(allTutor)
//         })

const result = await res.json();
 console.log( 'data after post', result);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      toast.add({
        type: "success",
        title: "Event created",
        description: `"${payload.title}" is now listed as an upcoming event.`,
      });

      setForm(EMPTY_FORM);
      setErrors({});
      setImageError(false);
    } catch (error) {
      console.error("Failed to create event", error);
      toast.add({
        type: "destructive",
        title: "Something went wrong",
        description: "Your event could not be saved. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setImageError(false);
  };

  return (
    <section className="container mx-auto flex flex-col gap-6 px-4 py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <p className="text-muted-foreground">
          Fill in the details below. Your event will show up on the{" "}
          <Link href="/upcoming" className="font-medium  text-blue-600 underline underline-offset-4">
            Upcoming Events
          </Link>{" "}
          page.
        </p>
      </div>

      <Card className="py-6 max-w-4xl mx-10">
        <CardHeader >
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles  />
            Event details
          </CardTitle>
          <CardDescription>
            All fields are required so attendees know what to expect.
          </CardDescription>
        </CardHeader>

        <CardContent className="">
          <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left column */}
            <FieldGroup>
              <Field data-invalid={errors.title ? true : undefined}>
                <FieldLabel htmlFor="event-title" className="text-lg font-bold">
                  Event title <span aria-hidden className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="event-title"
                  name="title"
                  placeholder="e.g. React Summit 2026"
                  value={form.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  aria-invalid={!!errors.title}
                />
                <FieldError>{errors.title}</FieldError>
              </Field>

              <Field data-invalid={errors.type ? true : undefined}>
                <FieldLabel className="text-lg font-bold">
                  Event type <span aria-hidden className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={form.type}
                  onValueChange={(value) => patch({ type: value as EventType })}
                >
                  <SelectTrigger className="w-full" aria-invalid={!!errors.type}>
                    <SelectValue placeholder="Pick an event type" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.type}</FieldError>
              </Field>

              <Field data-invalid={errors.date ? true : undefined}>
                <FieldLabel className="text-lg font-bold">
                  Event date <span aria-hidden className="text-destructive">*</span>
                </FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-between gap-2 font-normal",
                          !form.date && "text-muted-foreground"
                        )}
                        aria-invalid={!!errors.date}
                      />
                    }
                  >
                    {form.date ? (
                      <span>{formatDate(form.date)}</span>
                    ) : (
                      <span>Pick a future date</span>
                    )}
                    <CalendarIcon className="size-4 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={form.date}
                      onSelect={(date) => {
                        patch({ date });
                        setDateOpen(false);
                      }}
                      disabled={{ before: startOfToday() }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FieldDescription>
                  Past dates are disabled — the event must be in the future.
                </FieldDescription>
                <FieldError>{errors.date}</FieldError>
              </Field>

              <Field data-invalid={errors.location ? true : undefined}>
                <FieldLabel className="text-lg font-bold">
                  Location <span aria-hidden className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  value={form.location}
                  onValueChange={(value) => patch({ location: value })}
                >
                  <SelectTrigger
                    className="w-full"
                    aria-invalid={!!errors.location}
                  >
                    <SelectValue placeholder="Pick a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_LOCATIONS.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.location}</FieldError>
              </Field>
            </FieldGroup>

            {/* Right column */}
            <FieldGroup>
              <Field data-invalid={errors.imageUrl ? true : undefined}>
                <FieldLabel htmlFor="event-image" className="text-lg font-bold">
                  Image URL <span aria-hidden className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="event-image"
                  name="imageUrl"
                  type="url"
                  placeholder="https://..."
                  value={form.imageUrl}
                  onChange={(e) => {
                    patch({ imageUrl: e.target.value });
                    setImageError(false);
                  }}
                  aria-invalid={!!errors.imageUrl}
                />
                <FieldError>{errors.imageUrl}</FieldError>

                <div className="mt-2 flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/40">
                  {isValidImageUrl && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Event image preview"
                      className="h-full w-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                      <ImageIcon className="size-6" />
                      <span className="text-sm">
                        {imageError ? "Image could not be loaded" : "Image preview"}
                      </span>
                    </div>
                  )}
                </div>
              </Field>

              <Field data-invalid={errors.description ? true : undefined}>
                <FieldLabel htmlFor="event-description" className="text-lg font-bold">
                  Description <span aria-hidden className="text-destructive">*</span>
                </FieldLabel>
                <Textarea
                  id="event-description"
                  name="description"
                  placeholder="Short marketing description"
                  className="min-h-32"
                  value={form.description}
                  onChange={(e) => patch({ description: e.target.value })}
                  aria-invalid={!!errors.description}
                />
                <FieldError>{errors.description}</FieldError>
              </Field>
            </FieldGroup>

            {/* Actions */}
            <div className="flex flex-wrap justify-end items-end gap-3 lg:col-span-2">
             
             
              {/* <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Dates before today are not allowed
              </span> */}
               <Button type="button" variant="outline" onClick={handleClear}>
                <RotateCcw className="size-4" />
                Clear form
              </Button>
               <Button
                type="submit"
                disabled={submitting}
                className="bg-[#EB7036] p-4 text-white hover:bg-[#8a310b]"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Plus className="size-4" />
                )}
                {submitting ? "Saving event..." : "Create event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Toaster />
    </section>
  );
};

export default CreateEventPage;
