'use client';

import React from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';

export type DataTableExportType = 'csv' | 'excel';

interface DataTableExportDialogProps {
  open: boolean;
  type: DataTableExportType | null;

  loading?: boolean;

  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DataTableExportDialog({
  open,
  type,
  loading = false,
  onOpenChange,
  onConfirm,
}: DataTableExportDialogProps) {
  const isExcel = type === 'excel';

  const fileType = isExcel ? 'Excel' : 'CSV';

  const FileIcon = isExcel ? FileSpreadsheet : FileText;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg border">
            <FileIcon className="h-5 w-5" />
          </div>

          <DialogTitle>Export Data</DialogTitle>

          <DialogDescription>
            Are you sure you want to export this data as <strong>{fileType}</strong>?
            <br />
            The export will use your current search, filters, and sorting.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button type="button" disabled={loading || !type} onClick={onConfirm}>
            {loading ? 'Exporting...' : `Export ${fileType}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
