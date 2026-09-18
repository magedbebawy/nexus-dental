"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { assignDesignerToCase } from "@/lib/services/cases";
import type { Case, Profile } from "@/lib/types";

interface AssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCase: Case | null;
  designers: Profile[];
  onAssigned: () => void;
}

export function AssignModal({
  isOpen,
  onClose,
  targetCase,
  designers,
  onAssigned,
}: AssignModalProps) {
  const [selectedDesignerId, setSelectedDesignerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetCase || !selectedDesignerId) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = await assignDesignerToCase(targetCase.id, selectedDesignerId);
      if (success) {
        onAssigned();
        onClose();
      } else {
        setError("Failed to assign designer. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred while assigning.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign CAD Designer"
      description={
        targetCase
          ? `Assigning Case ${targetCase.case_number} (${targetCase.service} - ${targetCase.patient_reference})`
          : "Select a qualified CAD designer"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Select Designer"
          value={selectedDesignerId}
          onChange={(e) => setSelectedDesignerId(e.target.value)}
          required
        >
          <option value="" disabled className="bg-[#0b1329] text-slate-400">
            Choose a designer...
          </option>
          {designers.map((d) => (
            <option key={d.id} value={d.id} className="bg-[#0b1329] text-white">
              {d.name} ({d.email})
            </option>
          ))}
        </Select>

        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!selectedDesignerId}
          >
            Confirm Assignment
          </Button>
        </div>
      </form>
    </Modal>
  );
}
