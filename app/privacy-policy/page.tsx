"use client";

import PolicyLayout from "@/components/Policylayout";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      type="privacy"
      title="Privacy Policy"
      subtitle="We are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data when you use our platform and services."
      badgeIcon={<Shield size={13} />}
      crumb="Privacy Policy"
    />
  );
}
