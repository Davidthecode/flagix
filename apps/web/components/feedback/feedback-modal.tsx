"use client";

import { Button } from "@flagix/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@flagix/ui/components/dialog";
import { toast } from "@flagix/ui/components/sonner";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { api } from "@/lib/api";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");

  const feedbackMutation = useMutation({
    mutationFn: (feedback: string) =>
      api.post("/api/projects/feedback", { feedback }).then((res) => res.data),
    onSuccess: () => {
      toast.success("Thank you for your feedback! We read every submission.");
      setFeedback("");
      onClose();
    },
    onError: () => {
      const message = "Failed to submit feedback. Please try again.";
      toast.error(message);
    },
  });

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = () => {
    if (feedback.trim() && !feedbackMutation.isPending) {
      feedbackMutation.mutate(feedback.trim());
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFeedback("");
      onClose();
    }
  };

  const isFormValid = feedback.trim().length > 0;

  return (
    <Dialog onOpenChange={handleOpenChange} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Feedback</DialogTitle>
          <DialogDescription>
            We read every piece of feedback and use it to improve Flagix. Thank
            you for taking the time to share your thoughts!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <label
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="feedback"
            >
              Your Feedback
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              id="feedback"
              onChange={handleFeedbackChange}
              placeholder="Share your thoughts, suggestions, or report any issues..."
              rows={6}
              value={feedback}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            className="border border-gray-300 p-2 text-gray-700 text-sm hover:bg-gray-100"
            disabled={feedbackMutation.isPending}
            onClick={onClose}
            variant="ghost"
          >
            Cancel
          </Button>
          <Button
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:cursor-not-allowed"
            disabled={!isFormValid || feedbackMutation.isPending}
            onClick={handleSubmit}
          >
            {feedbackMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
