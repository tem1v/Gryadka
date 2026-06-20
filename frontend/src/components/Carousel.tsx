import type {UploadedFile} from "@/types/uploadedFileType.ts";
import {LucideChevronLeft, LucideChevronRight} from "lucide-react";
import { useState, useEffect } from 'react';

interface Props {
  items:{
    filename: string;
    plant: string;
    label: string;
    confidence: number
  }[],
  files:UploadedFile[]
}



export function Carousel({ items, files }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const goToPrevious = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  if (!items.length || !files.length) {
    return <div className="w-full h-96 bg-gray-100 flex items-center justify-center">Нет изображений</div>;
  }

  return (
    <div className="relative overflow-hidden w-full h-[400px] rounded-[12px]">
      <div className="relative w-full h-full rounded-[12px]">
        {items.map((item, idx) => {
          let translateX = '0%';
          if (idx === currentIndex) {
            translateX = '0%';
          } else if (direction === 'right') {
            translateX = idx < currentIndex ? '-100%' : '100%';
          } else {
            translateX = idx < currentIndex ? '-100%' : '100%';
          }

          return (
            <div
              key={idx}
              className={`absolute rounded-[12px] inset-0 transition-transform duration-500 ease-in-out ${
                idx === currentIndex ? 'z-10' : 'z-0'
              }`}
              style={{
                transform: `translateX(${translateX})`,
              }}
            >
              <img
                alt={item.filename}
                src={URL.createObjectURL(files[idx].fileObject)}
                className="w-full h-full object-cover rounded-[12px]"
                onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
              />
              <span className='absolute top-2 right-2 rounded-2xl bg-white py-1 px-2 font-semibold text-black z-20'>
                {item?.confidence ?? 'N/A'} %
              </span>
            </div>
          );
        })}
      </div>

      {files.length > 1 && <button
        onClick={goToPrevious}
        disabled={isAnimating}
        className='bg-white rounded-full text-black absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center p-2 hover:bg-gray-200 transition-colors z-20 disabled:opacity-50'
      >
        <LucideChevronLeft size={20} />
      </button>}

      {files.length > 1 && <button
        onClick={goToNext}
        disabled={isAnimating}
        className='bg-white rounded-full text-black absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center p-2 hover:bg-gray-200 transition-colors z-20 disabled:opacity-50'
      >
        <LucideChevronRight size={20} />
      </button>}

      {files.length > 1 && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => !isAnimating && setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? 'w-6 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>}
    </div>
  );
}