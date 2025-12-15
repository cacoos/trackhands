import { Footer, Navbar } from "../components";

export function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <main className="relative pt-12 pb-12 px-6 sm:px-10 lg:px-4">
        <article className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-display font-semibold mb-2">Privacy Policy</h1>
          <p className="text-muted text-sm mb-8">Last updated: December 14, 2025</p>

          <div className="space-y-8 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold mb-3">Overview</h2>
              <p className="text-muted">
                TrackHands is designed with privacy as a core principle. The app runs entirely on
                your device, and we do not collect, store, or transmit any of your data.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">What the App Accesses</h2>
              <p className="text-muted mb-3">
                TrackHands requires access to your camera to function. This access is used to:
              </p>
              <ul className="list-disc list-inside text-muted space-y-1 ml-2">
                <li>Detect your face and hand positions in real-time</li>
                <li>Determine when your fingers are near your mouth</li>
                <li>Display a warning overlay when this behavior is detected</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">How Your Data is Handled</h2>
              <ul className="list-disc list-inside text-muted space-y-1 ml-2">
                <li>
                  <strong className="text-foreground">Local Processing:</strong> All camera
                  processing happens locally on your device using MediaPipe. Your camera feed is
                  never transmitted over the internet.
                </li>
                <li>
                  <strong className="text-foreground">No Cloud Services:</strong> TrackHands does
                  not connect to any external servers or cloud services.
                </li>
                <li>
                  <strong className="text-foreground">No Analytics:</strong> We do not collect usage
                  statistics, crash reports, or any other telemetry data.
                </li>
                <li>
                  <strong className="text-foreground">No Accounts:</strong> The app does not require
                  registration or any personal information.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">What is Stored Locally</h2>
              <p className="text-muted mb-3">
                The following data is stored locally on your device:
              </p>
              <ul className="list-disc list-inside text-muted space-y-1 ml-2">
                <li>
                  <strong className="text-foreground">Settings:</strong> Your preferences (detection
                  speed, camera resolution) are saved in local storage.
                </li>
                <li>
                  <strong className="text-foreground">Screenshots:</strong> When a detection occurs,
                  a screenshot may be saved to help you build awareness. These images are stored
                  only on your device and are never uploaded anywhere.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Open Source</h2>
              <p className="text-muted">
                TrackHands is open source software licensed under the MIT License. You can review
                the complete source code on{" "}
                <a
                  href="https://github.com/cacoos/trackhands"
                  className="text-accent hover:underline"
                >
                  GitHub
                </a>{" "}
                to verify these privacy claims for yourself.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Third-Party Services</h2>
              <p className="text-muted">
                TrackHands uses MediaPipe, a machine learning library by Google, for hand and face
                detection. MediaPipe runs entirely on your device—no data is sent to Google or any
                other third party.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Changes to This Policy</h2>
              <p className="text-muted">
                If we make changes to this privacy policy, we will update the "Last updated" date at
                the top of this page. Since the app has no update mechanism that collects data, you
                can always check the latest version of this policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3">Contact</h2>
              <p className="text-muted">
                If you have any questions about this privacy policy, you can reach out on{" "}
                <a href="https://x.com/cacoos" className="text-accent hover:underline">
                  X (@cacoos)
                </a>{" "}
                or open an issue on{" "}
                <a
                  href="https://github.com/cacoos/trackhands/issues"
                  className="text-accent hover:underline"
                >
                  GitHub
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
