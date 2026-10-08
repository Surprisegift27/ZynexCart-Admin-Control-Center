import React, { useState } from 'react';
import {
  Star,
  Headphones,
  CheckCircle,
  MessageSquare,
  Send,
  RotateCcw,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SupportTicket } from '../types';

export const ReviewsSupportView: React.FC = () => {
  const {
    reviews,
    approveReview,
    replyToReview,
    supportTickets,
    updateTicketStatus,
    addTicketMessage,
    setSelectedOrderDetailId,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'support' | 'reviews'>('support');
  const [ratingFilter, setRatingFilter] = useState<'All' | number>('All');
  const [replyInputs, setReplyInputs] = useState<{ [id: string]: string }>({});
  const [ticketReplyInputs, setTicketReplyInputs] = useState<{ [id: string]: string }>({});

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'All' && r.rating !== ratingFilter) return false;
    return true;
  });

  const handleSendTicketReply = (ticketId: string) => {
    const text = ticketReplyInputs[ticketId];
    if (!text?.trim()) return;
    addTicketMessage(ticketId, text.trim());
    setTicketReplyInputs({ ...ticketReplyInputs, [ticketId]: '' });
  };

  const handleSendReviewReply = (reviewId: string) => {
    const text = replyInputs[reviewId];
    if (!text?.trim()) return;
    replyToReview(reviewId, text.trim());
    setReplyInputs({ ...replyInputs, [reviewId]: '' });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Customer Experience: Support &amp; Reviews</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Ticket management pipeline · Doorstep delivery ratings &amp; customer replies
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'support'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Support Tickets ({supportTickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Product Reviews &amp; Ratings ({reviews.length})</span>
        </button>
      </div>

      {/* 1. Support Tickets View matching Spec 15 */}
      {activeTab === 'support' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono-numbers text-xs font-bold text-indigo-400">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-bold text-white">{ticket.subject}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                        {ticket.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ticket.priority === 'Urgent' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ticket.priority} Priority
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Customer: <strong className="text-slate-200">{ticket.customerName}</strong> ({ticket.customerPhone}) · Order: <button onClick={() => setSelectedOrderDetailId(ticket.orderId)} className="text-emerald-400 font-mono-numbers hover:underline">{ticket.orderId}</button>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.id, e.target.value as any)}
                      className="p-1 bg-slate-950 border border-slate-700 rounded text-xs text-white"
                    >
                      <option value="New">New</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting Customer">Waiting Customer</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Message Trail */}
                <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 max-h-48 overflow-y-auto">
                  {ticket.messages.map((m, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-2 rounded-lg max-w-[85%] ${
                        m.sender === 'staff'
                          ? 'ml-auto bg-indigo-950/80 text-indigo-100 border border-indigo-800/60'
                          : 'mr-auto bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                        <span className="capitalize font-semibold">{m.sender}</span>
                        <span className="font-mono-numbers">{m.timestamp}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))}
                </div>

                {/* Staff Reply Bar */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={ticketReplyInputs[ticket.id] || ''}
                    onChange={(e) =>
                      setTicketReplyInputs({
                        ...ticketReplyInputs,
                        [ticket.id]: e.target.value,
                      })
                    }
                    placeholder="Type official reply or resolution update..."
                    className="flex-1 p-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendTicketReply(ticket.id);
                    }}
                  />
                  <button
                    onClick={() => handleSendTicketReply(ticket.id)}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Reviews View matching Spec 14 */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter Rating:</span>
            {[5, 4, 3, 2, 1].map((num) => (
              <button
                key={num}
                onClick={() => setRatingFilter(ratingFilter === num ? 'All' : num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-numbers font-bold flex items-center gap-1 cursor-pointer ${
                  ratingFilter === num
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                <span>{num}★</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-300 font-mono-numbers">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                      ))}
                      <span className="ml-1 text-xs font-bold text-white">{rev.rating}.0</span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        rev.sentiment === 'Positive'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : rev.sentiment === 'Negative'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {rev.sentiment}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white mt-2">{rev.productName}</h3>
                  <p className="text-xs text-slate-300 mt-1">&quot;{rev.comment}&quot;</p>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    By {rev.customerName} · {rev.createdAt}
                  </span>

                  {rev.adminReply && (
                    <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-200">
                      <strong className="block text-emerald-400">Admin Response:</strong>
                      {rev.adminReply}
                    </div>
                  )}
                </div>

                {!rev.adminReply && (
                  <div className="pt-2 border-t border-slate-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Write official store reply..."
                      value={replyInputs[rev.id] || ''}
                      onChange={(e) =>
                        setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })
                      }
                      className="flex-1 p-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendReviewReply(rev.id);
                      }}
                    />
                    <button
                      onClick={() => handleSendReviewReply(rev.id)}
                      className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
