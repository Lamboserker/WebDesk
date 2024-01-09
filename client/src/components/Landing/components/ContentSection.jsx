import {
  CloudArrowUpIcon,
  LockClosedIcon,
  ServerIcon,
} from "@heroicons/react/24/solid";
import BackgroundPattern from "./BackgroundPattern";

export default function ContentSection() {
  return (
    <div className="isolate overflow-hidden bg-transparent px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <BackgroundPattern />
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-indigo-600">
                Accelerate Deployment
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Streamline Your Workflow
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-700">
                Discover seamless integration with our platform, enhancing
                productivity and promoting efficient workflows. Experience the
                synergy of collaboration in real-time.
              </p>
            </div>
          </div>
        </div>
        <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
            src="https://cdn.discordapp.com/attachments/1185665614086426674/1192415025890086933/Bildschirmfoto_vom_2024-01-04_11-29-51.png?ex=65a8fe08&is=65968908&hm=521040ec497e4caef9406a763c4aed97514f67e4be21168554d49d0bb97c2521&"
            alt=""
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base leading-7 text-gray-700 lg:max-w-lg">
              <p>
                Immerse yourself in a platform where efficiency meets
                innovation. Enjoy streamlined processes and enhanced security,
                ensuring your projects are not just completed, but mastered.
              </p>
              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <CloudArrowUpIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Instant Deployment.
                    </strong>{" "}
                    Embrace the simplicity of push-to-deploy technology,
                    redefining the standards of efficiency and control.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <LockClosedIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Enhanced Security.
                    </strong>{" "}
                    Experience peace of mind with robust SSL encryption,
                    safeguarding your data at every step.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <ServerIcon
                    className="mt-1 h-5 w-5 flex-none text-indigo-600"
                    aria-hidden="true"
                  />
                  <span>
                    <strong className="font-semibold text-gray-900">
                      Reliable Backups.
                    </strong>{" "}
                    Never lose a moment of progress with automated, secure
                    database backups.
                  </span>
                </li>
              </ul>
              <p className="mt-8">
                Embrace a world where adaptability meets the precision of
                technology. Navigate with ease and build with confidence.
              </p>
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-gray-900">
                Serverless Solutions, Endless Possibilities.
              </h2>
              <p className="mt-6">
                Enter a realm where limitations are lifted. Our serverless
                architecture means your creativity is the only ceiling. Forge
                ahead into a future defined by your innovation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
