"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [fileId, setFileId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/media?userId=admin-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          provider: "GOOGLE_DRIVE",
          providerFileId: fileId,
        }),
      });

      const json = await res.json();
      if (res.ok && !json.error) {
        setMessage("Success! Media added.");
        setTitle("");
        setFileId("");
      } else {
        setMessage(json.error?.message || "Failed to add media.");
      }
    } catch {
      setMessage("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400">Add new media from Google Drive.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-surface p-6 rounded-lg border border-surface/50">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">Title</label>
          <input
            id="title"
            required
            className="w-full p-2 bg-background border border-gray-800 rounded outline-none focus:border-primary"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="fileId" className="text-sm font-medium">Google Drive File ID</label>
          <input
            id="fileId"
            required
            className="w-full p-2 bg-background border border-gray-800 rounded outline-none focus:border-primary"
            value={fileId}
            onChange={(e) => setFileId(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Media"}
        </Button>
        {message && (
          <div className="mt-4 p-3 rounded bg-black border border-gray-800 text-sm">
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
