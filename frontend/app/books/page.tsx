"use client";

import { useQuery } from "@apollo/client/react";
import { GET_BOOKS } from "@/lib/queries";
import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Book, Star, Calendar, Filter } from "lucide-react";
import { format } from "date-fns";
import { ProtectedRoute } from "@/lib/protected-route";

function BooksPageContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, loading, error, refetch } = useQuery<any>(GET_BOOKS, {
    variables: { 
      page: 1, 
      limit: 20,
      filter: searchTerm ? { title: searchTerm } : {}
    },
    fetchPolicy: "network-only"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch({ filter: { title: searchTerm } });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-400">
      Error loading books. Please ensure backend is running.
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Library Books</h1>
          <p className="text-slate-400 mt-1">Manage and explore your book collection</p>
        </div>
        <Link href="/books/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 w-fit">
          <Plus size={18} /> Add New Book
        </Link>
      </div>


      <div className="glass p-4 rounded-xl flex items-center gap-4">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search books by title..."
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-200 placeholder:text-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors" title="Filter options">
          <Filter size={20} />
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.books?.books.length === 0 ? (
          <div className="col-span-full text-center py-20 text-slate-500">
            <Book size={48} className="mx-auto mb-4 opacity-20" />
            <p>No books found matching your criteria.</p>
          </div>
        ) : (
          data?.books?.books.map((book: any) => (
            <Link key={book.id} href={`/books/${book.id}`} className="glass-card rounded-xl p-5 group block h-full">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Book size={20} />
                </div>
                {book.metadata?.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full text-xs font-medium">
                    <Star size={12} fill="currentColor" />
                    {book.metadata.averageRating.toFixed(1)}
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-bold mb-1 text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                {book.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-3 text-sm text-indigo-300/80">
                <span>by {book.author?.name}</span>
              </div>
              
              <p className="text-slate-400 mb-4 line-clamp-3 text-sm h-[60px]">
                {book.description || "No description available."}
              </p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/50 mt-auto">
                {book.published_date ? (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {format(new Date(parseInt(book.published_date)), "MMM yyyy")}
                  </span>
                ) : <span>Unknown date</span>}
                
                {book.metadata?.genre && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                    {book.metadata.genre}
                  </span>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <ProtectedRoute>
      <BooksPageContent />
    </ProtectedRoute>
  );
}
