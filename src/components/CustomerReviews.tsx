import React, { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, MessageSquarePlus, Search, X, Camera, Image as ImageIcon, ZoomIn, Upload } from 'lucide-react';
import { Language, Review } from '../types';
import { REVIEWS_DATA } from '../data/productData';
import { getTranslation } from '../data/translations';

interface CustomerReviewsProps {
  language?: Language;
  reviews?: Review[];
  onAddReview?: (review: Review) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  language = 'AR',
  reviews: externalReviews,
  onAddReview: externalOnAddReview,
}) => {
  const t = getTranslation(language);
  const [internalReviewsList, setInternalReviewsList] = useState<Review[]>(REVIEWS_DATA);
  const reviewsList = externalReviews || internalReviewsList;

  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [activeImageModal, setActiveImageModal] = useState<{ url: string; author: string; comment: string } | null>(null);

  // New review form state
  const [authorName, setAuthorName] = useState('');
  const [authorCity, setAuthorCity] = useState('Casablanca');
  const [newRating, setNewRating] = useState(5);
  const [hairType, setHairType] = useState('Curly 3B');
  const [comment, setComment] = useState('');
  const [reviewImage, setReviewImage] = useState<string | undefined>(undefined);

  const filteredReviews = reviewsList.filter((rev) => {
    const matchesRating = selectedRating === 'all' || rev.rating === selectedRating;
    const matchesSearch =
      rev.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.hairType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const photoReviews = reviewsList.filter((rev) => rev.imageUrl);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      author: authorName,
      city: authorCity,
      rating: newRating,
      date: 'Aujourd\'hui',
      comment: comment,
      hairType: hairType,
      verified: true,
      helpfulCount: 0,
      imageUrl: reviewImage,
    };

    if (externalOnAddReview) {
      externalOnAddReview(newRev);
    } else {
      setInternalReviewsList([newRev, ...internalReviewsList]);
    }

    setIsWriteModalOpen(false);
    setAuthorName('');
    setComment('');
    setReviewImage(undefined);
  };

  const handleHelpful = (revId: string) => {
    if (!externalReviews) {
      setInternalReviewsList((prev) =>
        prev.map((r) => (r.id === revId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
      );
    }
  };

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      
      {/* Header & Overall Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
          <div>
            <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              100% Real Customer Feedback
            </span>
            <h2 className="text-3xl font-black text-gray-900 mt-2">
              {t.reviewsTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-amber-50/80 p-4 rounded-2xl border border-amber-100">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-600">4.9</div>
              <div className="flex text-amber-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="ml-auto bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-800 transition flex items-center gap-1.5 shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>{t.writeReview}</span>
            </button>
          </div>
        </div>

        {/* Customer Photos Showcase Gallery */}
        {photoReviews.length > 0 && (
          <div className="space-y-3 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-gray-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Customer Results & Photos ({photoReviews.length})</span>
              </h3>
              <span className="text-xs text-gray-400">Click photo to zoom</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {photoReviews.map((rev) => (
                <button
                  key={`thumb-${rev.id}`}
                  onClick={() =>
                    setActiveImageModal({
                      url: rev.imageUrl!,
                      author: rev.author,
                      comment: rev.comment,
                    })
                  }
                  className="group relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-emerald-100 hover:border-emerald-500 transition shadow-sm"
                >
                  <img
                    src={rev.imageUrl}
                    alt={rev.author}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5 text-left text-[10px] text-white font-bold truncate">
                    {rev.author}
                  </div>
                  <div className="absolute top-1 right-1 bg-black/40 backdrop-blur-xs p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition">
                    <ZoomIn className="w-3 h-3" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Rating Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedRating('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedRating === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Reviews ({reviewsList.length})
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedRating(star)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 whitespace-nowrap ${
                  selectedRating === star
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </button>
            ))}
          </div>

        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                      <span>{rev.author}</span>
                      {rev.verified && (
                        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-gray-400">{rev.city} • {rev.hairType}</div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-700 mt-3 leading-relaxed">
                  "{rev.comment}"
                </p>

                {/* Review Photo Attachment */}
                {rev.imageUrl && (
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveImageModal({
                          url: rev.imageUrl!,
                          author: rev.author,
                          comment: rev.comment,
                        })
                      }
                      className="group relative inline-block rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition max-w-[200px]"
                    >
                      <img
                        src={rev.imageUrl}
                        alt={`Photo by ${rev.author}`}
                        className="w-full h-36 object-cover group-hover:scale-105 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition flex items-center justify-center">
                        <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm opacity-90 group-hover:opacity-100">
                          <ZoomIn className="w-3 h-3 text-emerald-600" /> Zoom
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>{rev.date}</span>
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-emerald-700 font-bold transition"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Image Zoom Modal */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full relative shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activeImageModal.url}
                alt={activeImageModal.author}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>

            <div className="p-5 bg-white space-y-1 border-t border-gray-100">
              <div className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <span>{activeImageModal.author}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  Verified Photo Result
                </span>
              </div>
              <p className="text-xs text-gray-600 italic">
                "{activeImageModal.comment}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xl font-black text-gray-900">{t.writeReview}</h3>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">{t.fullName}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salma K."
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-300 outline-none focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={authorCity}
                    onChange={(e) => setAuthorCity(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Hair Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Curly 3C"
                    value={hairType}
                    onChange={(e) => setHairType(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-gray-300 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write your opinion or experience with our Leave-In Mousse..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-gray-300 outline-none focus:border-emerald-600"
                />
              </div>

              {/* Photo Upload Section */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Add Photo Result (Optional)
                </label>
                {reviewImage ? (
                  <div className="relative inline-block border-2 border-emerald-500 rounded-2xl overflow-hidden">
                    <img src={reviewImage} alt="Uploaded preview" className="w-24 h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => setReviewImage(undefined)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-2xl hover:border-emerald-600 hover:bg-emerald-50/50 cursor-pointer transition text-gray-500 text-xs font-bold">
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>Upload customer result photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:bg-emerald-800 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

