/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useHeroSlider.ts
import { useEffect, useState } from 'react';
import { sliderService, Slider } from '@/services/slider.service';

interface UseHeroSliderReturn {
  sliders: Slider[];
  currentSlider: Slider | null;
  loading: boolean;
  error: string | null;
  currentIndex: number;
  goToNext: () => void;
  goToPrev: () => void;
  goToSlide: (index: number) => void;
}

export const useHeroSlider = (): UseHeroSliderReturn => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await sliderService.getActiveSliders({ perPage: 20 });
        setSliders(data);
        
        // لو في سلايدرات، خلي الأول هو الظاهر
        if (data.length > 0) {
          setCurrentIndex(0);
        }
        
      } catch (err: any) {
        console.error('Error fetching sliders:', err);
        setError(err?.message || 'فشل في تحميل السلايدرات');
        setSliders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSliders();
  }, []);

  // دوال التنقل
  const goToNext = () => {
    if (sliders.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % sliders.length);
  };

  const goToPrev = () => {
    if (sliders.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  const goToSlide = (index: number) => {
    if (index >= 0 && index < sliders.length) {
      setCurrentIndex(index);
    }
  };

  const currentSlider = sliders.length > 0 ? sliders[currentIndex] : null;

  return {
    sliders,
    currentSlider,
    loading,
    error,
    currentIndex,
    goToNext,
    goToPrev,
    goToSlide,
  };
};