"use client";

import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { CREATE_BOOK, GET_BOOKS } from "@/lib/queries";
import { ProtectedRoute } from "@/lib/protected-route";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

function CreateBookPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    published_date: "",
  });

  const [createBook, { loading, error }] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
    onCompleted: () => {
      showToast("Book created successfully", "success");
      router.push("/books");
    },
    onError: (error) => {
      const err: any = error;
      const errorMessage = err?.graphQLErrors?.[0]?.message || err?.message || "Failed to create book";
      showToast(errorMessage, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("User not authenticated", "error");
      return;
    }
    
    createBook({
      variables: {
        input: {
          ...formData,
          author_id: user.authorId,
        },
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/books" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Book</h1>
          <p className="text-slate-400 mt-1">Add a new book to the library collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 rounded-xl space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
            {error.message}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Book Title <span className="text-red-400">*</span></label>
          <input
            type="text"
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
            placeholder="e.g. The Hobbit"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Publishing as</label>
          <div className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-300">
            {user?.name}
          </div>
          <p className="text-xs text-slate-500">Books will be published under your author profile.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Published Date</label>
          <input
            type="date"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
            value={formData.published_date}
            onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Description</label>
          <textarea
            rows={5}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 resize-none"
            placeholder="Write a short summary..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/books" className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Saving..." : "Save Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateBookPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "AUTHOR"]}>
      <CreateBookPageContent />
    </ProtectedRoute>
  );
}
