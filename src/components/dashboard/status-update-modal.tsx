"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Label } from "../ui/label";

interface StatusUpdateModalProps {
  companyId: string | null;
  isOpen: boolean;
  onClose: () => void;
  /** Now also passes back the note text */
  onSuccess: (companyId: string, status: string, note: string) => void;
  companies: Array<{ _id: string; name: string; status: string; note?: string }>;
}

export function StatusUpdateModal({
  companyId,
  isOpen,
  onClose,
  onSuccess,
  companies,
}: StatusUpdateModalProps) {
  const [status, setStatus] = useState("");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const company = companies.find((c) => c._id === companyId);

  // When the modal opens or company changes, populate status & note
  useEffect(() => {
    if (company) {
      setStatus(company.status);
      setNote(company.note ?? "");
    }
  }, [company]);

  const handleUpdate = async () => {
    if (!companyId || !status) return;

    setIsLoading(true);
    try {
      // Replace this with your real API call...
      await new Promise((resolve) => setTimeout(resolve, 500));

      onSuccess(companyId, status, note);
      toast.success("Status & note updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">
            Update Application Details for {company?.name}.
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status selector */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-300">
            Status
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {[
                "Not Applied",
                "Applied",
                "Shortlisted",
                "Pre Placement Talk",
                "OA",
                "Aptitude round",
                "GD",
                "Technical round",
                "Interview",
                "Offer",
                "Rejected",
              ].map((s) => (
                <SelectItem key={s} value={s} className="text-white hover:bg-gray-700">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          </div>
          {/* Note textarea */}
          <div className="flex flex-col">
            <label htmlFor="company-note" className="mb-1 text-gray-300">
              Add a Note (optional)
            </label>
            <textarea
              id="company-note"
              rows={4}
              className="bg-gray-700 border border-gray-600 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Interview scheduled for next week…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={!status || isLoading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            {isLoading ? (
              <>
                <div className="spinner mr-2" /> Updating...
              </>
            ) : (
              "Update"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
