"use client";

import { AgreementContent } from "./AgreementContent";
import { AppModal } from "./AppModal";

type AgreementModalProps = {
  acceptLabel?: string;
  dismissible?: boolean;
  submitting?: boolean;
  onAccept: () => void;
  onCancel?: () => void;
  onLogout?: () => void;
};

export function AgreementModal({
  acceptLabel = "Agree & Continue",
  dismissible = true,
  submitting = false,
  onAccept,
  onCancel,
  onLogout,
}: AgreementModalProps) {
  return (
    <AppModal
      onClose={dismissible ? onCancel : undefined}
      dismissible={dismissible}
      labelledBy="agreement-title"
    >
      <AgreementContent
        acceptLabel={acceptLabel}
        submitting={submitting}
        showCancel={dismissible}
        showLogout={!dismissible && Boolean(onLogout)}
        onAccept={onAccept}
        onCancel={onCancel}
        onLogout={onLogout}
      />
    </AppModal>
  );
}
