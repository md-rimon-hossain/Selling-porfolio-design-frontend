import { useState, useCallback } from "react";
import { useToggleLikeMutation, useCheckIfLikedQuery } from "@/services/api";
import { useAppSelector } from "@/store/hooks";

interface UseLikeOptions {
  designId: string;
  initialLikesCount?: number;
  onSuccess?: (liked: boolean) => void;
  onError?: (error: unknown) => void;
}

export const useLike = ({
  designId,
  initialLikesCount = 0,
  onSuccess,
  onError,
}: UseLikeOptions) => {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = !!user;

  // Check if user has already liked this design
  const {
    data: likeCheckData,
    isLoading: isCheckingLike,
    refetch: refetchLikeStatus,
  } = useCheckIfLikedQuery(designId, {
    skip: !isAuthenticated, // Skip if not logged in
  });

  const [toggleLike, { isLoading: isTogglingLike }] = useToggleLikeMutation();

  // Local state for optimistic updates
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  // Determine current like status
  const isLiked =
    optimisticLiked !== null
      ? optimisticLiked
      : likeCheckData?.data?.liked || false;

  // Determine current like count
  const likesCount =
    optimisticCount !== null ? optimisticCount : initialLikesCount;

  // Handle like toggle
  const handleToggleLike = useCallback(
    async (e?: React.MouseEvent) => {
      // Prevent event bubbling if called from a clickable parent
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      // Require authentication
      if (!isAuthenticated) {
        onError?.({
          message: "Please login to like designs",
          requiresAuth: true,
        });
        return;
      }

      // Optimistic update
      const newLikedState = !isLiked;
      const newCount = newLikedState ? likesCount + 1 : likesCount - 1;

      setOptimisticLiked(newLikedState);
      setOptimisticCount(newCount);

      try {
        const response = await toggleLike(designId).unwrap();

        // Update with server response
        setOptimisticLiked(response.data.liked);
        setOptimisticCount(response.data.likesCount);

        // Refetch like status to keep in sync
        refetchLikeStatus();

        onSuccess?.(response.data.liked);
      } catch (error: unknown) {
        // Revert optimistic update on error
        setOptimisticLiked(!newLikedState);
        setOptimisticCount(likesCount);

        console.error("Error toggling like:", error);
        onError?.(error);
      }
    },
    [
      designId,
      isAuthenticated,
      isLiked,
      likesCount,
      toggleLike,
      refetchLikeStatus,
      onSuccess,
      onError,
    ]
  );

  return {
    isLiked,
    likesCount,
    isLoading: isCheckingLike || isTogglingLike,
    isAuthenticated,
    handleToggleLike,
  };
};
