"use client";

import PolicyLayout from "@/components/Policylayout";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <PolicyLayout
      type="terms"
      title="Terms &amp; Conditions"
      subtitle="Please read these terms carefully before using our services. By accessing our platform, you agree to be bound by the conditions outlined in this document."
      badgeIcon={<FileText size={13} />}
      crumb="Terms & Conditions"
    />
  );
}
