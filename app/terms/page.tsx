import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Flotik Resume",
  description: "Terms of Service for Flotik Resume Builder.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">Terms of Service</h1>
        
        <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            By accessing and using Flotik Resume Builder ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">2. Description of Service</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Flotik Resume provides an AI-powered resume building tool that allows users to create, edit, and download professional resumes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">3. User Conduct</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            You agree not to use the Service for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the Service in any way that could damage the Service, the services, or the general business of Flotik.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">4. Intellectual Property</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            The Service and its original content, features, and functionality are and will remain the exclusive property of Flotik and its licensors.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">5. Termination</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We may terminate your access to the Service, without cause or notice, which may result in the forfeiture and destruction of all information associated with you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">6. Contact Information</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            If you have any questions about these Terms, please contact us at <a href="mailto:flotcik.support@gmail.com" className="text-blue-600 hover:underline">flotcik.support@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
