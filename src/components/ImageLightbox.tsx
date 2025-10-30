"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  alt?: string;
}

export default function ImageLightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  alt = "Image",
}: ImageLightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const translateStartRef = useRef<{ x: number; y: number } | null>(null);

  // Reset state when opening/closing or changing image
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setTranslate({ x: 0, y: 0 });
      setIsLoading(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          navigateImage(-1);
          break;
        case "ArrowRight":
          navigateImage(1);
          break;
        case "+":
        case "=":
          handleZoom(0.25);
          break;
        case "-":
        case "_":
          handleZoom(-0.25);
          break;
        case "0":
          resetZoom();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const navigateImage = useCallback(
    (direction: number) => {
      const newIndex =
        (currentIndex + direction + images.length) % images.length;
      onIndexChange(newIndex);
    },
    [currentIndex, images.length, onIndexChange]
  );

  const handleZoom = useCallback((delta: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(4, prev + delta)));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      resetZoom();
    } else {
      setZoom(2);
    }
  }, [zoom, resetZoom]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(delta);
    },
    [handleZoom]
  );

  // Touch/pan handling
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (zoom <= 1) return;

      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      translateStartRef.current = { ...translate };
    },
    [zoom, translate]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !dragStartRef.current || !translateStartRef.current)
        return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      setTranslate({
        x: translateStartRef.current.x + deltaX,
        y: translateStartRef.current.y + deltaY,
      });
    },
    [isDragging]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    dragStartRef.current = null;
    translateStartRef.current = null;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage(-1);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigateImage(1);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-black bg-opacity-50 rounded-full p-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoom(-0.25);
          }}
          className="p-2 text-white hover:text-blue-400 transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <span className="text-white text-sm px-3 min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleZoom(0.25);
          }}
          className="p-2 text-white hover:text-blue-400 transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        {zoom > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }}
            className="p-2 text-white hover:text-blue-400 transition-colors ml-2"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-6 left-6 z-10 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main Image */}
      <div
        className="relative max-w-[95vw] max-h-[95vh] overflow-hidden rounded-lg"
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          ref={imageRef}
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          width={1920}
          height={1080}
          className={`max-w-full max-h-full object-contain cursor-${
            zoom > 1 ? "grab" : "zoom-in"
          } transition-transform duration-200 ${
            isDragging ? "cursor-grabbing" : ""
          }`}
          style={{
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          draggable={false}
        />
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2 max-w-[80vw] overflow-x-auto p-2 bg-black bg-opacity-50 rounded-lg">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onIndexChange(index);
              }}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-white scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={48}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-6 right-6 z-10 bg-black bg-opacity-50 text-white text-xs px-3 py-2 rounded-lg max-w-xs">
        <p>
          Use mouse wheel to zoom • Drag to pan • Double-click to toggle zoom
        </p>
        <p className="mt-1">
          Keyboard: Esc (close) • ←→ (navigate) • +/- (zoom)
        </p>
      </div>
    </div>
  );
}
