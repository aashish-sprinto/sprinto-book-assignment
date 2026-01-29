"use client";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { GET_AUTHORS } from "@/lib/queries";
import { ProtectedRoute } from "@/lib/protected-route";
import { useToast } from "@/lib/toast-context";

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($input: CreateAuthorInput!) {
    createAuthor(input: $input) {
      id
      name
    }
  }
`;

function CreateAuthorPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    biography: "",
    born_date: "",
  });

  const [createAuthor, { loading, error }] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
    onCompleted: () => {
      showToast("Author created successfully", "success");
      router.push("/authors");
    },
    onError: (error) => {
      const err: any = error;
      const errorMessage = err?.graphQLErrors?.[0]?.message || err?.message || "Failed to create author";
      showToast(errorMessage, "error");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAuthor({
      variables: {
        input: formData,
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Link href="/authors" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add New Author</h1>
          <p className="text-slate-400 mt-1">Create a profile for a new author</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass p-8 rounded-xl space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
            {error.message}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Full Name <span className="text-red-400">*</span></label>
          <input
            type="text"
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
            placeholder="e.g. J.R.R. Tolkien"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Date of Birth</label>
          <input
            type="date"
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200"
            value={formData.born_date}
            onChange={(e) => setFormData({ ...formData, born_date: e.target.value })}
          />
          <p className="text-xs text-slate-500">Leaving this empty is allowed if unknown.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Biography</label>
          <textarea
            rows={5}
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 resize-none"
            placeholder="Write a short biography..."
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          />
        </div>

        <div className="pt-4 flex justify-end gap-4">
          <Link href="/authors" className="px-6 py-2.5 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {loading ? "Saving..." : "Save Author"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CreateAuthorPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <CreateAuthorPageContent />
    </ProtectedRoute>
  );
}
