"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";
import clsx from "clsx";

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  const phoneNumber = "911234567890"; 

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Create the WhatsApp URL with the encoded message
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open in a new tab (this will prompt the user to open WhatsApp app or Web)
    window.open(url, "_blank", "noopener,noreferrer");
    
    // Clear message and optionally close widget
    setMessage("");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end pointer-events-none">
      
      {/* Expanded Widget */}
      <div 
        className={clsx(
          "bg-white rounded-2xl shadow-2xl mb-4 w-[calc(100vw-3rem)] sm:w-80 max-w-[20rem] overflow-hidden transition-all duration-300 origin-bottom-right pointer-events-auto",
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-[#25D366] p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Chat with us</h4>
              <p className="text-xs text-white/80">Typically replies instantly</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Chat Area */}
        <div className="bg-[#E5DDD5] p-4 h-32 relative">
          <div className="bg-white rounded-lg p-3 text-sm text-gray-800 shadow-sm inline-block max-w-[85%] relative before:absolute before:content-[''] before:w-0 before:h-0 before:border-t-[10px] before:border-t-transparent before:border-b-[10px] before:border-b-transparent before:border-r-[10px] before:border-r-white before:-left-2 before:top-2">
            Hi! How can we help you plan your next celebration?
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-[#F0F2F5]">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-full px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#25D366] border-none"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#20bd5a] transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] hover:scale-110 active:scale-95 transition-all duration-300 rounded-full shadow-[0_4px_14px_rgba(37,211,102,0.4)] flex items-center justify-center pointer-events-auto"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <svg className="w-8 h-8 fill-white" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
      </button>

    </div>
  );
}
