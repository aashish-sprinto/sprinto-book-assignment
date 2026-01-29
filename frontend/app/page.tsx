"use client";

import { useQuery } from "@apollo/client/react";
import { GET_BOOKS } from "@/lib/queries";
import Link from "next/link";
import { ArrowRight, Star, Book, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { data, loading, error } = useQuery<any>(GET_BOOKS, {
    variables: { limit: 6, page: 1 },
  });

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-400">
      Error loading library content. Please ensure backend is running.
    </div>
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500">

      <section className="text-center py-16 px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Discover a world of <span className="heading-gradient">Knowledge</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Explore our curated collection of books and authors. Track your reading, leave reviews, and find your next adventure.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/books" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
            Browse Books <ArrowRight size={18} />
          </Link>
          <Link href="/authors" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
            Meet Authors
          </Link>
        </div>
      </section>


      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Recent Additions</h2>
          <Link href="/books" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View all <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.books?.books.map((book: any) => (
            <Link key={book.id} href={`/books/${book.id}`} className="glass-card rounded-xl p-6 group cursor-pointer block">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Book size={24} />
                </div>
                {book.metadata?.averageRating > 0 && (
                  <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full text-xs font-medium">
                    <Star size={12} fill="currentColor" />
                    {book.metadata.averageRating.toFixed(1)}
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                {book.title}
              </h3>
              
              <p className="text-slate-400 mb-4 line-clamp-2 text-sm h-10">
                {book.description || "No description available."}
              </p>
              
              <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-700/50">
                <span className="flex items-center gap-1">
                  By {book.author?.name}
                </span>
                {book.published_date && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(parseInt(book.published_date)), "yyyy")}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
