import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Flotick Resume",
  description: "Terms of Service for Flotick Resume Builder.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto prose">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">Terms of Service</h1>
        
        <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-neutral-600">
            By using Flotick Resume ("the Service"), you agree to these terms. The tool is provided "as is" for your personal and professional use.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">2. Free to Use</h2>
          <p className="text-neutral-600">
            Flotick Resume is completely free to use. There are no subscriptions, hidden fees, or payment requirements. You do not need to create an account to access any features.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">3. Content Responsibility</h2>
          <p className="text-neutral-600">
            You are solely responsible for the content you enter into the resume builder. Since we do not store your data on our servers, it is your responsibility to save or export your resumes (e.g., as PDF) to ensure you don't lose your work.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">4. Intellectual Property</h2>
          <p className="text-neutral-600">
            You retain full ownership of the content you create. The templates and software architecture are the property of Flotick.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">5. Disclaimer of Warranty</h2>
          <p className="text-neutral-600">
            The Service is provided without warranties of any kind. While we strive to provide the best AI suggestions and templates, we do not guarantee employment results or the total accuracy of AI-generated content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">6. Contact Information</h2>
          <p className="text-neutral-600">
            If you have any questions about these Terms, please contact us at <a href="mailto:support@flotick.com" className="text-blue-600 hover:underline">support@flotick.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
