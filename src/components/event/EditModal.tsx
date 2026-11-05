"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  ListBox,
  Label,
  Select,
  FieldError,
  Modal,
  Surface,
  TextField,
} from "@heroui/react";
import { toast } from "react-toastify";
import { FaRegEdit } from "react-icons/fa";

// ✅ Helpers
const getTodayString = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const toDateInputValue = (dateStr?: string) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

interface MyEventList {
  _id: string;
  imageUrl?: string;
  image?: string;
  title: string;
  location?: { venue: string };
  date?: string;
  description?: string;
  category?: string;
  status?: string;
  price?: number;
  condition?: string;
}

interface EditModalProps {
  eventList: MyEventList;
}

const CATEGORY_OPTIONS = [
  { id: "Donation", label: "Donation" },
  { id: "Cleanup", label: "Cleanup" },
  { id: "Workshop", label: "Workshop" },
  { id: "Plantation", label: "Plantation" },
  { id: "Food Drive", label: "Food Drive" },
] as const;

const LOCATION_OPTIONS = [
  { id: "Uttara,Dhaka", label: "Uttara, Dhaka" },
  { id: "Badda,Dhaka", label: "Badda, Dhaka" },
  { id: "Mohammadpur,Dhaka", label: "Mohammadpur, Dhaka" },
  { id: "Mirpur,Dhaka", label: "Mirpur, Dhaka" },
  { id: "Dhanmondi,Dhaka", label: "Dhanmondi, Dhaka" },
] as const;

const EditModal = ({ eventList }: EditModalProps) => {
  const {
    _id,
    title,
    category,
    imageUrl,
    image,
    location,
    description,
    date, // ✅
  } = eventList;

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    category ?? null
  );
  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    location?.venue ?? null
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const updatedEvent = Object.fromEntries(formData.entries());

    // ✅ Past date validation
    const selectedDate = String(updatedEvent.date ?? "");
    if (!selectedDate) {
      toast.error("Please select an event date");
      return;
    }
    if (selectedDate < getTodayString()) {
      toast.error("Past date select করা যাবে না");
      return;
    }

    console.log("updated event", updatedEvent);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/manage/${_id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedEvent),
        }
      );

      if (!res.ok) {
        toast.error("Failed to update product", {
          autoClose: 4000,
          position: "top-center",
        });
        return;
      }

      const data = await res.json();
      console.log("Updated data", data);

      toast.success("Product updated", {
        autoClose: 4000,
        position: "top-center",
      });

      setIsOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        <FaRegEdit />
      </Button>

      <Modal.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-md">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground" />
              <Modal.Heading>Update Event</Modal.Heading>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface variant="default">
                <form onSubmit={onSubmit} className="p-2 space-y-8 m-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <TextField defaultValue={title} name="title" isRequired>
                        <Label>Event Title</Label>
                        <Input
                          placeholder="Enter your event name"
                          className="rounded-2xl"
                        />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* Description */}
                    <TextField
                      defaultValue={description}
                      name="description"
                      type="text"
                      isRequired
                    >
                      <Label>Description</Label>
                      <Input
                        type="text"
                        placeholder="description"
                        className="rounded-2xl"
                      />
                      <FieldError />
                    </TextField>

                    {/* Category */}
                    <div>
                      <Label>Event type</Label>
                      <Select
                        value={selectedCategory}
                        onChange={(key) => setSelectedCategory(key as string)}
                        name="category"
                        isRequired
                        className="rounded-2xl hover:bg-slate-300"
                        placeholder="Event type"
                      >
                        <Select.Trigger className="rounded-2xl">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {CATEGORY_OPTIONS.map((opt) => (
                              <ListBox.Item
                                key={opt.id}
                                id={opt.id}
                                textValue={opt.label}
                              >
                                {opt.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                      <TextField
                        defaultValue={imageUrl ?? image}
                        name="imageUrl"
                        isRequired
                      >
                        <Label>Image URL</Label>
                        <Input
                          type="url"
                          placeholder="Enter your photo url"
                          className="rounded-2xl"
                        />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* ✅ Date — শুধু future select করা যাবে */}
                    <div className="md:col-span-2">
                      <TextField
                        defaultValue={toDateInputValue(date)}
                        name="date"
                        isRequired
                      >
                        <Label>Event Date</Label>
                        <Input
                          type="date"
                          min={getTodayString()}
                          className="rounded-2xl"
                        />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* Location */}
                    <div>
                      <Label>Location</Label>
                      <Select
                        value={selectedLocation}
                        onChange={(key) => setSelectedLocation(key as string)}
                        name="location"
                        isRequired
                        className="rounded-2xl hover:bg-slate-300 text-black"
                        placeholder="Select location"
                      >
                        <Select.Trigger className="rounded-2xl">
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {LOCATION_OPTIONS.map((opt) => (
                              <ListBox.Item
                                key={opt.id}
                                id={opt.id}
                                textValue={opt.label}
                              >
                                {opt.label}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-2xl w-full bg-cyan-500 text-white font-bold"
                  >
                    Save
                  </Button>
                </form>
              </Surface>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
};

export default EditModal;