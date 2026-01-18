import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Flotick Resume",
  description: "Privacy Policy for Flotick Resume Builder.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto prose">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">Privacy Policy</h1>
        
        <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">1. No Data Storage on Our Servers</h2>
          <p className="text-neutral-600">
            Flotick Resume is a "browser-first" application. We do not maintain any databases to store your personal information, work history, or contact details. All data you enter into the builder is stored locally in your browser's storage (LocalStorage) and is never transmitted to our servers for storage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">2. No User Accounts</h2>
          <p className="text-neutral-600">
            There are no sign-ups, registrations, or user accounts required to use Flotick Resume. We do not collect or store email addresses, passwords, or profile information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">3. AI Analysis & Processing</h2>
          <p className="text-neutral-600">
            When you use our AI analysis tools, your resume content is sent to an AI processing service (such as Gemini or OpenAI) to provide suggestions and analysis. This data is processed ephemerally and is not stored by Flotick. We do not use your personal resume data to train AI models.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">4. No Payments or Financial Data</h2>
          <p className="text-neutral-600">
            Flotick Resume is 100% free. We do not have any payment systems integrated, and we never ask for credit card information or any other financial data.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">5. Cookies & Analytics</h2>
          <p className="text-neutral-600">
            We may use minimal analytics cookies to understand how our visitors interact with the website. These analytics are anonymized and do not include any personal information from your resumes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">6. Contact Us</h2>
          <p className="text-neutral-600">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@flotick.com" className="text-blue-600 hover:underline">support@flotick.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
