import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Flotik Resume",
  description: "Privacy Policy for Flotik Resume Builder.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <p className="text-sm text-neutral-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">1. Information Collection</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We collect information you provide directly to us when you use our resume builder, including personal information you include in your resume such as your name, contact details, work experience, and education.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">2. Use of Information</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We use the information we collect to provide, maintain, and improve our services, including to generate your resume, improve our AI algorithms (in an anonymized manner), and communicate with you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">3. Data Storage and Security</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. However, remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">4. Cookies</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">5. Changes to This Privacy Policy</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">6. Contact Us</h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:flotcik.support@gmail.com" className="text-blue-600 hover:underline">flotcik.support@gmail.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
