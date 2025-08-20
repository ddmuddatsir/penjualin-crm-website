"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { motion } from "framer-motion";
import React from "react";
import { useLeadActivities } from "@/hooks/useLeadActivities";
import { AddActivityDialog } from "./AddActivityDialog";
import type { ClientLead } from "@/types/firebase";

type LeadDetailDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: ClientLead | null;
  onEdit: () => void;
};

export function LeadDetailDrawer({
  open,
  onOpenChange,
  lead,
  onEdit,
}: LeadDetailDrawerProps) {
  const [addActivityOpen, setAddActivityOpen] = useState(false);
  // Load activities for this lead
  const { data: activities = [], isLoading: activitiesLoading } =
    useLeadActivities(lead?.id || null);

  // Create default activity if none exist
  const displayActivities =
    activities.length === 0
      ? [
          {
            id: `default-${lead?.id}`,
            type: "CREATED",
            description: `Lead ${lead?.name} created for ${lead?.company}`,
            assignedTo: "System",
            createdAt: lead?.createdAt || new Date(),
            notes: "Initial lead creation activity",
          },
        ]
      : activities;

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {lead.name}
            <Badge variant="outline" className="uppercase">
              {lead.status}
            </Badge>
          </DialogTitle>
          <div className="text-sm text-gray-500">{lead.company}</div>
          <div className="text-sm text-gray-500">{lead.email}</div>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <Button size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddActivityOpen(true)}
            >
              Tambah Aktivitas
            </Button>
            <Button size="sm" variant="secondary">
              Kirim Email
            </Button>
          </div>
          <div>
            <div className="font-semibold mb-2">Activity Log</div>
            <div className="space-y-2">
              {activitiesLoading ? (
                <div className="text-xs text-gray-400">
                  Loading activities...
                </div>
              ) : displayActivities.length === 0 ? (
                <div className="text-xs text-gray-400">Belum ada aktivitas</div>
              ) : (
                displayActivities.map(
                  (
                    activity: {
                      id: string;
                      type: string;
                      description?: string;
                      assignedTo?: string;
                      createdAt?: Date;
                      notes?: string;
                    },
                    i: number
                  ) => (
                    <motion.div
                      key={activity.id || i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs"
                    >
                      <span className="font-semibold">{activity.type}</span>
                      {activity.assignedTo &&
                        ` oleh ${activity.assignedTo}`}{" "}
                      pada{" "}
                      {activity.createdAt
                        ? new Date(activity.createdAt).toLocaleString()
                        : "Unknown date"}
                      <br />
                      <span className="text-gray-500">
                        {activity.description || activity.notes}
                      </span>
                    </motion.div>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <AddActivityDialog
        open={addActivityOpen}
        onOpenChange={setAddActivityOpen}
        lead={lead}
      />
    </Dialog>
  );
}
