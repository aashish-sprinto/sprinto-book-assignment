"use client";

import { useQuery } from "@apollo/client/react";
import { GET_AUTHORS } from "@/lib/queries";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, User, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { ProtectedRoute } from "@/lib/protected-route";

function AuthorsPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, refetch } = useQuery<any>(GET_AUTHORS, {
    variables: { 
      page: 1, 
      limit: 20,
      filter: searchTerm ? { name: searchTerm } : {}
    },
    fetchPolicy: "network-only"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch({ filter: { name: searchTerm } });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-400">
      Error loading authors. Please ensure backend is running.
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Authors</h1>
          <p className="text-slate-400 mt-1">Meet the creative minds behind the stories</p>
        </div>
        <Link href="/authors/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 w-fit">
          <Plus size={18} /> Add New Author
        </Link>
      </div>

      {/* Search */}
      <div className="glass p-4 rounded-xl flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search authors by name..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.authors?.authors.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            <User size={48} className="mx-auto mb-4 opacity-20" />
            <p>No authors found matching your criteria.</p>
          </div>
        ) : (
          data?.authors?.authors.map((author: any) => (
            <div key={author.id} className="glass-card rounded-xl p-6 group">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {author.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {author.name}
                  </h3>
                  {author.born_date && (
                    <p className="text-sm text-slate-400">
                      Born: {format(new Date(parseInt(author.born_date)), "MMMM d, yyyy")}
                    </p>
                  )}
                </div>
              </div>
              
              <p className="text-slate-400 mb-6 line-clamp-3 text-sm h-[60px]">
                {author.biography || "No biography available."}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full text-sm">
                  <BookOpen size={16} />
                  <span>{author.books?.length || 0} Books Published</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function AuthorsPage() {
  return (
    <ProtectedRoute>
      <AuthorsPageContent />
    </ProtectedRoute>
  );
}
