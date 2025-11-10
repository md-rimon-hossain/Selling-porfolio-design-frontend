"use client";

import React from "react";
import { useLike } from "@/hooks/useLike";
import { useRouter } from "next/navigation";

interface LikeButtonProps {
  designId: string;
  initialLikesCount?: number;
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "full" | "compact";
  className?: string;
  showCount?: boolean;
  onLikeChange?: (liked: boolean) => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  designId,
  initialLikesCount = 0,
  size = "md",
  variant = "full",
  className = "",
  showCount = true,
  onLikeChange,
}) => {
  const router = useRouter();

  const { isLiked, likesCount, isLoading, handleToggleLike } = useLike({
    designId,
    initialLikesCount,
    onSuccess: (liked) => {
      onLikeChange?.(liked);
    },
    onError: (error: unknown) => {
      const err = error as { requiresAuth?: boolean; message?: string };
      if (err?.requiresAuth) {
        // Redirect to login if not authenticated
        router.push(`/login?redirect=/designs/${designId}`);
      }
    },
  });

  // Size variants
  const sizeClasses = {
    sm: {
      icon: "w-3 h-3",
      button: "p-1.5",
      text: "text-xs",
    },
    md: {
      icon: "w-4 h-4",
      button: "p-2",
      text: "text-sm",
    },
    lg: {
      icon: "w-5 h-5",
      button: "p-2.5",
      text: "text-base",
    },
  };

  const sizes = sizeClasses[size];

  // Icon only variant
  if (variant === "icon") {
    return (
      <button
        onClick={handleToggleLike}
        disabled={isLoading}
        className={`${
          sizes.button
        } rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
          isLiked
            ? "bg-red-100 hover:bg-red-200"
            : "bg-gray-100 hover:bg-gray-200"
        } ${className}`}
        title={isLiked ? "Unlike" : "Like"}
        aria-label={isLiked ? "Unlike this design" : "Like this design"}
      >
        {isLoading ? (
          <svg
            className={`${sizes.icon} animate-spin text-gray-400`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className={`${sizes.icon} ${
              isLiked ? "text-red-500" : "text-gray-500"
            } transition-colors`}
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isLiked ? 0 : 2}
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        )}
      </button>
    );
  }

  // Compact variant (icon + count)
  if (variant === "compact") {
    return (
      <button
        onClick={handleToggleLike}
        disabled={isLoading}
        className={`flex items-center gap-1 ${
          sizes.text
        } font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
          isLiked ? "text-red-500" : "text-gray-500"
        } ${className}`}
        title={isLiked ? "Unlike" : "Like"}
        aria-label={`${likesCount} likes. Click to ${
          isLiked ? "unlike" : "like"
        }`}
      >
        {isLoading ? (
          <svg
            className={`${sizes.icon} animate-spin`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className={`${sizes.icon} transition-colors`}
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isLiked ? 0 : 2}
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        )}
        {showCount && <span>{likesCount}</span>}
      </button>
    );
  }

  // Full variant (button with icon and count)
  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
        isLiked
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${className}`}
      aria-label={`${likesCount} likes. Click to ${
        isLiked ? "unlike" : "like"
      }`}
    >
      {isLoading ? (
        <svg
          className={`${sizes.icon} animate-spin`}
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        <svg
          className={`${sizes.icon} transition-transform ${
            isLiked ? "scale-110" : "scale-100"
          }`}
          fill={isLiked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={isLiked ? 0 : 2}
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      )}
      <span className={sizes.text}>
        {isLiked ? "Liked" : "Like"}
        {showCount && ` (${likesCount})`}
      </span>
    </button>
  );
};

// Animated heart icon component for floating hearts effect
export const AnimatedHeart: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  return (
    <div
      className={`inline-block animate-ping-once ${className}`}
      style={{
        animation: "ping 0.5s cubic-bezier(0, 0, 0.2, 1)",
      }}
    >
      <svg
        className="w-6 h-6 text-red-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </div>
  );
};
