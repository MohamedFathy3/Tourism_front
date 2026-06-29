// src/components/FloatingButtons.tsx
import { Phone, MessageCircle } from "lucide-react";
import { useContact } from "@/hooks/useContact";

const FloatingButtons = () => {
  const { contactData, loading } = useContact();

  // استخدام رقم الهاتف من الـ API أو fallback
  const phoneNumber = contactData?.phone_one || "";
  // تنظيف رقم الهاتف (إزالة أي مسافات أو أحرف غير رقمية)
  const cleanPhone = phoneNumber.replace(/\s/g, '').replace(/^\+/, '');

  return (
    <div className="fixed bottom-6 start-6 z-50 flex flex-col gap-3">
      {/* زر الاتصال الهاتفي */}
      <a
        href={`tel:+${cleanPhone}`}
        className="w-12 h-12 rounded-full bg-[#e0b277] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[#e0b277]/50"
        aria-label="Call us"
      >
        <Phone size={20} />
      </a>

      {/* زر واتساب */}
      <a
        href={`https://wa.me/${cleanPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-[#25D366]/50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={20} />
      </a>
    </div>
  );
};

export default FloatingButtons;