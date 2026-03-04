import Hero from "./hero";

export default function TermsCondition() {
  return (
    <>
      <Hero />

      <div className="min-h-screen bg-slate-50 text-slate-800">
        <div className="max-w-8xl mx-auto px-6 sm:px-12 lg:px-20 xl:px-40 py-6 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar Navigation */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Terms Overview</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    "Definitions",
                    "Eligibility",
                    "Account Responsibilities",
                    "Membership Obligations",
                    "Pension Scheme",
                    "Commission Policy",
                    "Wallet & Payments",
                    "Role-Based Access",
                    "Prohibited Activities",
                    "Content & Communication",
                    "Suspension & Termination",
                    "System Availability",
                    "Data Protection",
                    "Limitation of Liability",

                    "Governing Law",
                    "Contact",
                  ].map((item, index) => (
                    <li key={index}>
                      <a
                        href={`#section-${index + 1}`}
                        className="block hover:text-[#29A36A] transition"
                      >
                        {index + 1}. {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-10">
              {/* Important Notice */}
              <div className="bg-blue-50 border-l-4 border-[#29A36A] p-6 rounded-xl shadow-sm">
                <h2 className="text-lg font-semibold mb-2">Important Notice</h2>
                <p className="text-sm leading-relaxed">
                  By registering, accessing, or using the Platform, you agree to
                  be legally bound by these Terms. If you do not agree, you must
                  discontinue use immediately.
                </p>
              </div>

              {/* Reusable Section Component */}
              {sections.map((section, index) => (
                <section
                  key={index}
                  id={`section-${index + 1}`}
                  className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 scroll-mt-24"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 p-2 flex items-center justify-center rounded-full bg-[#29A36A] text-white font-bold mr-4">
                      {index + 1}
                    </div>
                    <h2 className="text-2xl font-semibold">{section.title}</h2>
                  </div>

                  <div className="space-y-4 text-sm leading-relaxed text-slate-600">
                    {section.content}
                  </div>
                </section>
              ))}

              {/* Contact Section */}
              <section
                id="section-18"
                className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 scroll-mt-24"
              >
                <h2 className="text-2xl font-semibold mb-6">
                  Contact Information
                </h2>

                <div className="space-y-3 text-sm text-slate-600">
                  <p>
                    <strong>Expro Welfare Foundation</strong>
                  </p>
                  <p>Email: ewf.bogura.bd@gmail.com</p>
                  <p>Phone: +8801304-493937</p>
                  <p>
                    Address: Boshundhara Villa, Sher-e-Bangla Nagar, Nishindara,
                    Bogura Sadar, Bogura-5800
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============================= */
/* Terms Data */
/* ============================= */

const sections = [
  {
    title: "Definitions",
    content: (
      <>
        <p>
          <strong>Foundation:</strong> Refers to Expro Welfare Foundation.
        </p>
        <p>
          <strong>Platform:</strong> Website, mobile application, dashboards,
          and related systems.
        </p>
        <p>
          <strong>Member:</strong> General Member, Executive Member, Project
          Presenter (PP), Assistant Project Presenter (APP).
        </p>
        <p>
          <strong>Admin:</strong> Authorized system administrators.
        </p>
        <p>
          <strong>Wallet:</strong> Internal digital balance ledger within the
          Platform.
        </p>
      </>
    ),
  },
  {
    title: "Eligibility & Registration",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>Users must provide accurate and truthful information.</li>
          <li>Membership approval is subject to administrative review.</li>
          <li>
            The Foundation may approve or reject applications without disclosing
            reasons.
          </li>
          <li>Users must comply with applicable laws and policies.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Account Responsibilities",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>Maintain confidentiality of login credentials.</li>
          <li>Responsible for all activities under your account.</li>
          <li>Report unauthorized access immediately.</li>
          <li>Keep profile information updated.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Membership Obligations",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>Pay monthly membership contributions.</li>
          <li>
            Failure to pay for six (6) months may result in automatic
            suspension.
          </li>
          <li>Outstanding dues required for reactivation.</li>
          <li>Digital ID cards remain property of the Foundation.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Pension Scheme Terms",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>Available to eligible active members only.</li>
          <li>Installments must follow selected package schedule.</li>
          <li>Maturity amounts calculated automatically.</li>
          <li>Packages may be modified with prior notice.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Commission & Sponsorship Policy",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>Commission based on approved sponsorship structure.</li>
          <li>Team-based 10% rule applies where defined.</li>
          <li>Credited after confirmed payment processing.</li>
          <li>Fraud results in immediate suspension.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Wallet & Payment Terms",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-2">
          <li>Payments must be processed through the Platform.</li>
          <li>Processed via SSLCOMMERZ or authorized providers.</li>
          <li>Wallet balances are non-transferable.</li>
          <li>Refunds subject to administrative review.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Role-Based Access & Restrictions",
    content: (
      <p>
        Users may only access features permitted under their assigned role.
        Unauthorized access attempts may result in termination and legal action.
      </p>
    ),
  },
  {
    title: "Prohibited Activities",
    content: (
      <ul className="list-disc pl-6 space-y-2">
        <li>Hacking or disrupting the system.</li>
        <li>Submitting false financial records.</li>
        <li>Impersonation or data misuse.</li>
        <li>Bypassing security controls.</li>
      </ul>
    ),
  },
  {
    title: "Content & Communication",
    content: (
      <p>
        Submitted content may be reviewed, edited, or removed. System
        notifications (email, SMS, dashboard alerts) are considered official
        communication.
      </p>
    ),
  },
  {
    title: "Suspension & Termination",
    content: (
      <p>
        Accounts may be suspended for non-payment, violations, or fraudulent
        activity. Wallet transactions may be frozen pending investigation.
      </p>
    ),
  },
  {
    title: "System Availability & Maintenance",
    content: (
      <p>
        The Platform aims for 24/7 availability but may experience downtime due
        to maintenance or unforeseen technical issues.
      </p>
    ),
  },
  {
    title: "Data Protection & Privacy",
    content: (
      <p>
        Personal and financial data is processed according to the Privacy Policy
        for membership management, pension calculation, commission tracking, and
        legal compliance.
      </p>
    ),
  },
  {
    title: "Limitation of Liability",
    content: (
      <p>
        The Foundation shall not be liable for indirect damages, payment gateway
        failures, incorrect user information, or external delays.
      </p>
    ),
  },

  {
    title: "Governing Law & Dispute Resolution",
    content: (
      <p>
        These Terms are governed by applicable laws of the Foundation’s
        registered jurisdiction. Disputes will be resolved via legal or
        arbitration channels.
      </p>
    ),
  },
];
