import React from "react";
import { CheckIcon } from "@heroicons/react/20/solid";

const ProAccount = () => {
  const includedFeatures = [
    "Access to exclusive tutorials and courses",
    "Download of premium resources",
    "Entry to expert webinars",
    "Discounts on conferences and workshops",
    "Monthly newsletter with industry insights",
  ];
  return (
    <div className="bg-luckyPoint-200 dark:bg-luckyPoint-700 w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Straightforward No-Tricks Pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Secure a premium membership to access all our content and take
              your career to the next level.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 dark:ring-gray-700 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Lifetime Membership
              </h3>
              <p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
                Invest once in your future and enjoy lifelong access to valuable
                learning resources and community events.
              </p>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600 dark:text-indigo-400">
                  What’s Included
                </h4>
                <div className="h-px flex-auto bg-gray-100 dark:bg-gray-700" />
              </div>
              <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 dark:text-gray-300 sm:grid-cols-2 sm:gap-6"
              >
                {includedFeatures.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-indigo-600 dark:text-indigo-400"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div
                className="rounded

-2xl bg-gray-50 dark:bg-gray-700 py-10 text-center ring-1 ring-inset ring-gray-900/5 dark:ring-gray-200/5 lg:flex lg:flex-col lg:justify-center lg:py-16"
              >
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
                    Pay Once, Own it Forever
                  </p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                      $349
                    </span>
                    <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600 dark:text-gray-300">
                      USD
                    </span>
                  </p>
                  <a
                    href="#"
                    className="mt-10 block w-full rounded-md bg-indigo-600 dark:bg-indigo-700 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 dark:hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Get Access
                  </a>
                  <p className="mt-6 text-xs leading-5 text-gray-600 dark:text-gray-300">
                    Invoices and receipts available for easy company
                    reimbursement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProAccount;
