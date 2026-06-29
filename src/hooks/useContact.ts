/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useContact.ts
import { useEffect, useState, useCallback } from 'react';
import { contactService, ContactData, ContactPageResponse, ContactFormData, ContactFormResponse } from '@/services/contact.service';

interface UseContactReturn {
  contactPage: ContactPageResponse | null;
  contactData: ContactData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  sendMessage: (data: ContactFormData) => Promise<ContactFormResponse>;
  isSending: boolean;
}

export const useContact = (): UseContactReturn => {
  const [contactPage, setContactPage] = useState<ContactPageResponse | null>(null);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  // جلب بيانات صفحة الاتصال
  const fetchContactPage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await contactService.getContactPage();
      
      if (response && response.data && response.data.length > 0) {
        setContactPage(response);
        setContactData(response.data[0]);
      } else {
        setContactPage(null);
        setContactData(null);
        setError('لا توجد بيانات اتصال');
      }
      
    } catch (err: any) {
      console.error('Error fetching contact page:', err);
      setError(err?.message || 'فشل في تحميل بيانات صفحة الاتصال');
      setContactPage(null);
      setContactData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // إرسال رسالة
  const sendMessage = useCallback(async (data: ContactFormData): Promise<ContactFormResponse> => {
    try {
      setIsSending(true);
      const response = await contactService.sendContactForm(data);
      return response;
    } catch (err: any) {
      console.error('Error sending message:', err);
      return {
        success: false,
        message: err?.message || 'فشل في إرسال الرسالة',
      };
    } finally {
      setIsSending(false);
    }
  }, []);

  useEffect(() => {
    fetchContactPage();
  }, [fetchContactPage]);

  return {
    contactPage,
    contactData,
    loading,
    error,
    refetch: fetchContactPage,
    sendMessage,
    isSending,
  };
};