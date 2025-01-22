import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar"

export default function ConsumerOnboarding() {
  return (
    <div>
    <NavBar />
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Coming Soon</h1>
          <p className="text-lg text-gray-600">
            We&apos;re working hard to bring you an amazing consumer onboarding experience.
            Stay tuned!
          </p>
        </div>
      </main>
    </Layout>
    </div>
  );
}
