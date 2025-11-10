import { useState, useCallback, useRef, useEffect } from "react";
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
  const isProcessingRef = useRef(false);

  // Check if user has already liked this design
  const { data: likeCheckData, isLoading: isCheckingLike } =
    useCheckIfLikedQuery(designId, {
      skip: !isAuthenticated, // Skip if not logged in
    });

  const [toggleLike, { isLoading: isTogglingLike }] = useToggleLikeMutation();

  // Local state for optimistic updates
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  // Store previous state for revert
  const previousStateRef = useRef<{ liked: boolean; count: number } | null>(
    null
  );

  // Reset optimistic state when server data changes
  useEffect(() => {
    if (likeCheckData?.data?.liked !== undefined && !isProcessingRef.current) {
      setOptimisticLiked(null);
    }
  }, [likeCheckData?.data?.liked]);

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

      // Prevent multiple clicks while processing (use ref to avoid stale closure)
      if (isProcessingRef.current || isTogglingLike) {
        console.log("Already processing, ignoring click");
        return;
      }

      isProcessingRef.current = true;

      // Store current state before optimistic update
      previousStateRef.current = {
        liked: isLiked,
        count: likesCount,
      };

      // Optimistic update
      const newLikedState = !isLiked;
      const newCount = newLikedState ? likesCount + 1 : likesCount - 1;

      console.log("Optimistic update:", { newLikedState, newCount });
      setOptimisticLiked(newLikedState);
      setOptimisticCount(newCount);

      try {
        const response = await toggleLike(designId).unwrap();

        console.log("Server response:", response.data);

        // Update with server response (this is the source of truth)
        setOptimisticLiked(response.data.liked);
        setOptimisticCount(response.data.likesCount);

        onSuccess?.(response.data.liked);
      } catch (error: unknown) {
        console.error("Error toggling like, reverting:", error);

        // Revert to previous state using stored ref
        if (previousStateRef.current) {
          setOptimisticLiked(previousStateRef.current.liked);
          setOptimisticCount(previousStateRef.current.count);
        }

        onError?.(error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    [
      designId,
      isAuthenticated,
      isLiked,
      likesCount,
      isTogglingLike,
      toggleLike,
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
