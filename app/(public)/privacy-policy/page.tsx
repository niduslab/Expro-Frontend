"use client";
import { ArrowDown } from "lucide-react";
import Hero from "./hero";
import { useState, ReactNode } from "react";

interface PrivacySection {
  title: string;
  content: ReactNode;
}

const privacySections: PrivacySection[] = [
  {
    title: "Data Collection",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Personal Data:</strong> Full name, date of birth, gender,
            contact details, membership info, sponsorship or referral info.
          </li>
          <li>
            <strong>Financial Data:</strong> Wallet balances, transactions,
            payment history, pension contributions, commissions, payment
            confirmations.
          </li>
          <li>
            <strong>System & Usage Data:</strong> IP address, browser & device
            type, login timestamps, activity logs.
          </li>
          <li>
            <strong>Communication Data:</strong> Emails, SMS alerts,
            notifications, support requests.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Use of Information",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Membership registration and verification</li>
        <li>Pension scheme enrollment and tracking</li>
        <li>Wallet management and commission tracking</li>
        <li>Team management and project coordination</li>
        <li>Notifications, alerts, and reminders</li>
        <li>Administrative oversight and auditing</li>
        <li>Security, fraud prevention, and system optimization</li>
        <li>
          The Platform does not sell or rent personal information to third
          parties
        </li>
      </ul>
    ),
  },
  {
    title: "Legal Basis for Data Processing",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>User consent provided at registration or via the Platform</li>
        <li>Performance of membership contracts and financial obligations</li>
        <li>Compliance with legal or regulatory requirements</li>
        <li>Legitimate organizational and administrative interests</li>
        <li>Security, auditing, and fraud prevention measures</li>
      </ul>
    ),
  },
  {
    title: "Data Security Measures",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Secure login and password hashing</li>
        <li>Role-Based Access Control (RBAC)</li>
        <li>HTTPS encryption for all data in transit</li>
        <li>Server-side validation, authorization, and audit logs</li>
        <li>Automated backups for critical data</li>
        <li>API rate limiting and security monitoring</li>
      </ul>
    ),
  },
  {
    title: "Data Retention",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Data retained for active membership duration</li>
        <li>Financial, pension, and commission records maintained</li>
        <li>Suspended/inactive accounts archived as required by law</li>
      </ul>
    ),
  },
  {
    title: "Sharing & Third-Party Services",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Payment gateways for transactions</li>
        <li>Regulatory or law enforcement authorities</li>
        <li>Internal administrators for system management</li>
        <li>Third-party services required to maintain confidentiality</li>
      </ul>
    ),
  },
  {
    title: "User Rights",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Access and review personal information</li>
        <li>Request updates or corrections</li>
        <li>Request account deactivation, deletion, or data export</li>
        <li>Withdraw consent for data collection</li>
        <li>View transaction and contribution history</li>
      </ul>
    ),
  },
  {
    title: "Cookies & Tracking",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Authentication and session management</li>
        <li>Security monitoring and fraud prevention</li>
        <li>Performance and analytics</li>
        <li>
          Cookie settings manageable via browser; disabling may affect
          functionality
        </li>
      </ul>
    ),
  },
  {
    title: "Children’s Privacy",
    content: (
      <p>
        Platform is not intended for users under 18 without parental/guardian
        consent. Membership eligibility rules apply.
      </p>
    ),
  },
  {
    title: "Automated Processes",
    content: (
      <p>
        Financial calculations (pensions, commissions) and account suspensions
        are system-generated. Alerts notify users about dues, suspensions, or
        renewals. All critical operations are logged.
      </p>
    ),
  },
  {
    title: "International Data Transfers",
    content: (
      <p>
        If infrastructure is hosted outside your country, data is securely
        transferred and processed in compliance with applicable laws.
      </p>
    ),
  },
  {
    title: "Updates to the Privacy Policy",
    content: (
      <p>
        Policy may be revised periodically. Changes will be posted with the
        updated date. Continued use constitutes acceptance of updated policies.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <>
      <Hero />

      <div className="min-h-screen bg-gray-50 text-gray-800 py-12">
        <div className="max-w-8xl mx-auto px-6 sm:px-12 lg:px-20 xl:px-40 py-6 sm:py-8 lg:py-10">
          {/* Page Header */}
          <div className="font-dm-sans text-start mb-12">
            <h1 className="text-4xl font-bold mb-2">List of all policies</h1>
            <h3 className="text-xs font-dm-sans font-light mb-2">
              By using our services, you agree to the practices outlined in this
              policy.
            </h3>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-6 ">
            {privacySections.map((sec, idx) => (
              <div
                key={idx}
                onClick={() => toggleSection(idx)}
                className="bg-slate-100 hover:bg-green-50  pb-5 border border-gray-200 rounded-2xl shadow-sm overflow-hidden"
              >
                <button className="w-full text-left px-6 py-4  flex justify-between items-center focus:outline-none">
                  <span className="text-lg font-semibold">{sec.title}</span>
                  <span
                    className={`text-xl transform transition-transform duration-300 ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  >
                    <ArrowDown className="h-4 w-4 text-[#36F293]" />
                  </span>
                </button>

                <div
                  className={`px-6 pb-6 transition-all duration-300 overflow-hidden ${
                    openIndex === idx ? "max-h-[2000px] pt-2" : "max-h-0"
                  }`}
                >
                  <div className="text-sm text-gray-600 space-y-4">
                    {sec.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
