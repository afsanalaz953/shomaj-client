
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

// ---------- Helpers ----------
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

// স্পেস এবং কেস ইগনোর করার জন্য
const normalize = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "").replace(/,/g, "");

// ---------- Types ----------
interface MyEventList {
  _id: string;
  imageUrl?: string;
  image?: string;
  title: string;
  location?: { venue: string } | string; // স্ট্রিং বা অবজেক্ট দুটোই হ্যান্ডেল করবে
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

// ---------- Component ----------
const EditModal = ({ eventList }: EditModalProps) => {
  const {
    _id,
    title,
    category,
    imageUrl,
    image,
    location,
    description,
    date,
  } = eventList;

  const LOCATION_IDS = [
    "Uttara,Dhaka",
    "Badda, Dhaka",
    "Mohammadpur, Dhaka",
    "Mirpur, Dhaka",
    "Dhanmondi, Dhaka",
  ];

  // ✅ লোকেশন স্ট্রিং নাকি অবজেক্ট চেক করা
  const rawVenue = typeof location === "string" ? location : location?.venue;
  
  // ✅ ডিফল্ট ভ্যালু নরমালাইজ করে বের করা
  const initialLocation = rawVenue
    ? LOCATION_IDS.find((id) => normalize(id) === normalize(rawVenue)) ?? ""
    : "";

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(category ?? "");
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // ✅ API তে ডেটা পাঠানোর সময় location কে অবজেক্ট {} হিসেবে পাঠানো হচ্ছে
    const updatedEvent = {
      title: formData.get("title"),
      description: formData.get("description"),
      imageUrl: formData.get("imageUrl"),
      date: formData.get("date"),
      category: selectedCategory,
      location: { venue: selectedLocation }, // <--- অবজেক্ট হিসেবে সেভ হবে
    };

    const selectedDate = String(updatedEvent.date ?? "");
    if (selectedDate < getTodayString()) {
      toast.error("Past date select করা যাবে না");
      return;
    }

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
        toast.error("Failed to update event", { autoClose: 4000 });
        return;
      }

      toast.success("Event updated successfully", { autoClose: 4000 });
      setIsOpen(false); // মডাল বন্ধ হবে

      // ✅ ব্রাউজার পুরোপুরি রিফ্রেশ হবে এবং নতুন লোকেশন টেবিলে দেখা যাবে
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
                        <Input placeholder="Enter event name" className="rounded-2xl" />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* Description */}
                    <TextField defaultValue={description} name="description" isRequired>
                      <Label>Description</Label>
                      <Input placeholder="description" className="rounded-2xl" />
                      <FieldError />
                    </TextField>

                    {/* Category */}
                    <div>
                      <Label>Event type</Label>
                      <Select
                        key={`cat-${selectedCategory}`}
                        value={selectedCategory || null}
                        onChange={(key) => setSelectedCategory(key ? String(key) : "")}
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
                            <ListBox.Item id="Donation" textValue="Donation">Donation<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="Cleanup" textValue="Cleanup">Cleanup<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="Workshop" textValue="Workshop">Workshop<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="Plantation" textValue="Plantation">Plantation<ListBox.ItemIndicator /></ListBox.Item>
                            <ListBox.Item id="Food Drive" textValue="Food Drive">Food Drive<ListBox.ItemIndicator /></ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Image URL */}
                    <div className="md:col-span-2">
                      <TextField defaultValue={imageUrl ?? image} name="imageUrl" isRequired>
                        <Label>Image URL</Label>
                        <Input type="url" placeholder="Enter photo url" className="rounded-2xl" />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* Date */}
                    <div className="md:col-span-2">
                      <TextField defaultValue={toDateInputValue(date)} name="date" isRequired>
                        <Label>Event Date</Label>
                        <Input type="date" min={getTodayString()} className="rounded-2xl" />
                        <FieldError />
                      </TextField>
                    </div>

                    {/* ✅ Location (with default value and no map) */}
                    <div className="md:col-span-2">
                      <Label>Location</Label>
                      <Select
                        key={`loc-${selectedLocation}`} // ✅ ডিফল্ট ভ্যালু দেখানোর জন্য key
                        value={selectedLocation || null}  // ✅ controlled value
                        onChange={(key) => setSelectedLocation(key ? String(key) : "")}
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
                            <ListBox.Item id="Uttara,Dhaka" textValue="Uttara, Dhaka">
                              Uttara, Dhaka<ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Badda, Dhaka" textValue="Badda, Dhaka">
                              Badda, Dhaka<ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Mohammadpur, Dhaka" textValue="Mohammadpur, Dhaka">
                              Mohammadpur, Dhaka<ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Mirpur, Dhaka" textValue="Mirpur, Dhaka">
                              Mirpur, Dhaka<ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="Dhanmondi, Dhaka" textValue="Dhanmondi, Dhaka">
                              Dhanmondi, Dhaka<ListBox.ItemIndicator />
                            </ListBox.Item>
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