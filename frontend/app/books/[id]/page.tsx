"use client";

import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { GET_BOOK_DETAILS, DELETE_BOOK, GET_BOOKS } from "@/lib/queries";
import { ArrowLeft, Star, Calendar, Trash2, User, MessageSquare } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useState } from "react";
import { useToast } from "@/lib/toast-context";

const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      rating
      comment
      reviewerName
    }
  }
`;

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const id = params?.id as string;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
    reviewerName: "",
  });

  const { data, loading, error, refetch } = useQuery<any>(GET_BOOK_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const [deleteBook] = useMutation(DELETE_BOOK, {
    onCompleted: () => {
      showToast("Book deleted successfully", "success");
      router.push("/books");
    },
    onError: (error: any) => {
      const err: any = error;
      const errorMessage = err?.graphQLErrors?.[0]?.message || err?.message || "Failed to delete book";
      showToast(errorMessage, "error");
      setShowDeleteConfirm(false);
    },
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [createReview, { loading: reviewLoading }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      setReviewForm({ rating: 5, comment: "", reviewerName: "" });
      showToast("Review submitted successfully", "success");
      refetch();
    },
    onError: (error: any) => {
      const err: any = error;
      const errorMessage = err?.graphQLErrors?.[0]?.message || err?.message || "Failed to submit review";
      showToast(errorMessage, "error");
    },
  });

  const handleDelete = () => {
    deleteBook({ variables: { id } });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createReview({
      variables: {
        input: {
          bookId: parseInt(id),
          ...reviewForm,
          rating: parseInt(reviewForm.rating.toString()),
        },
      },
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20 text-red-400">
      Error loading book details.
    </div>
  );

  const book = data?.book;

  if (!book) return (
    <div className="text-center py-20 text-slate-400">
      Book not found.
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      <div className="flex items-center justify-between">
        <Link href="/books" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white flex items-center gap-2">
          <ArrowLeft size={20} /> Back to Books
        </Link>
        <button 
          onClick={() => setShowDeleteConfirm(true)}
          className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          <Trash2 size={18} /> Delete Book
        </button>
      </div>


      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl max-w-md w-full space-y-4">
            <h3 className="text-xl font-bold text-white">Delete Book?</h3>
            <p className="text-slate-400">Are you sure you want to delete "{book.title}"? This action cannot be undone and will remove all associated reviews.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass p-8 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium mb-4">
                {book.metadata?.genre || "Fiction"}
              </span>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{book.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
                <span className="flex items-center gap-2">
                  <User size={18} className="text-indigo-400" />
                  {book.author?.name}
                </span>
                {book.published_date && (
                  <span className="flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-400" />
                    {format(new Date(parseInt(book.published_date)), "MMMM d, yyyy")}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-400" fill="currentColor" />
                  {book.metadata?.averageRating?.toFixed(1) || "0.0"} ({book.metadata?.totalReviews || 0} reviews)
                </span>
                <span className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-indigo-400" />
                  {book.reviews?.length || 0} reviews
                </span>
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <p className="text-slate-300 leading-relaxed">
                  {book.description || "No description provided for this book."}
                </p>
              </div>
            </div>
          </div>


          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              Reviews <span className="text-slate-500 text-lg font-normal">({book.reviews?.length || 0})</span>
            </h3>
            
            {book.reviews?.length === 0 ? (
              <div className="text-slate-500 italic">No reviews yet. Be the first to review!</div>
            ) : (
              <div className="space-y-4">
                {book.reviews.map((review: any) => (
                  <div key={review.id} className="glass p-6 rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-white">{review.reviewerName}</div>
                      <div className="flex gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-300">{review.comment}</p>
                    <div className="text-xs text-slate-500 mt-2">
                      {format(new Date(parseInt(review.createdAt)), "MMM d, yyyy")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>


        <div className="space-y-6">
          <div className="glass p-6 rounded-xl sticky top-24">
            <h3 className="text-xl font-bold mb-4">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200"
                  value={reviewForm.reviewerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      className={`p-1 hover:scale-110 transition-transform ${
                        star <= reviewForm.rating ? "text-yellow-400" : "text-slate-600"
                      }`}
                    >
                      <Star size={24} fill={star <= reviewForm.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Comment</label>
                <textarea
                  required
                  rows={4}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 resize-none"
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={reviewLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                {reviewLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
