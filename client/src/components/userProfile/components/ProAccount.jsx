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
    <>
      <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
        <h1 className="mb-10 text-3xl font-extrabold text-gray-900 dark:text-white  md:text-5xl lg:text-6xl ">
          Get a Pro Account
        </h1>
        <div className=" bg-white shadow-md rounded-xl px-10 py-8 mb-8 flex flex-col space-y-6 mt-3">
          <div className="min-w-screen min-h-screen bg-gray-100 px-5 py-5 mt-10 items-center">
            <div className="w-full mx-auto bg-white px-5 py-10 text-gray-900 mb-10 items-center">
              <div className="max-w-5xl mx-auto md:flex">
                <div className="md:w-1/4 md:flex md:flex-col">
                  <div className="text-left w-full flex-grow md:pr-5">
                    <h1 className="text-4xl font-bold mb-5">
                      Explore Our Flexible Pricing Plans
                    </h1>
                    <h3 className="text-md font-medium mb-5">
                      Choose the perfect plan that suits your needs. Affordable
                      options for individuals, teams, and enterprises.*
                    </h3>
                  </div>
                  <div className="w-full mb-2">
                    <p className="text-xs">
                      *Pricing terms and conditions apply.
                    </p>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <div className="max-w-4xl mx-auto md:flex">
                    <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-2 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
                      <div className="w-full flex-grow">
                        <h2 className="text-center font-bold uppercase mb-4">
                          Personal Plan - Ideal for Individuals
                        </h2>
                        <h3 className="text-center font-bold text-4xl mb-5 mt-6">
                          $5<span className="text-sm">/mo</span>
                        </h3>
                        <ul className="text-sm mb-8">
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Unlimited access to basic features.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i> 24/7
                            customer support.
                          </li>
                        </ul>
                      </div>
                      <div className="w-full">
                        <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                          Upgrade Now
                        </button>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:-mx-3 md:mb-0 rounded-md shadow-lg shadow-gray-600 md:relative md:z-50 md:flex md:flex-col">
                      <div className="w-full flex-grow">
                        <h2 className="text-center font-bold uppercase mb-4">
                          Team Plan - Perfect for Small Teams
                        </h2>
                        <h3 className="text-center font-bold text-4xl md:text-5xl mb-5 mt-6">
                          $15<span className="text-sm">/mo</span>
                        </h3>
                        <ul className="text-sm mb-8">
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Collaboration tools included.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Priority customer support.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Analytics dashboard.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Comprehensive Data Analysis Capabilities
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Premium Customer Support and Service Guarantee
                          </li>
                        </ul>
                      </div>
                      <div className="w-full">
                        <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                          Upgrade Now
                        </button>
                      </div>
                    </div>
                    <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-2 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
                      <div className="w-full flex-grow">
                        <h2 className="text-center font-bold uppercase ">
                          Pro Plan -<br />
                        </h2>
                        <span className="text-sm  text-center uppercase ">
                          Advanced Features for Professionals
                        </span>
                        <h3 className="text-center font-bold text-4xl mb-5 mt-6">
                          $35<span className="text-sm">/mo</span>
                        </h3>
                        <ul className="text-sm mb-8">
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i> All
                            features in the Personal and Team plans.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Advanced analytics and reporting.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Custom integrations.
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i>{" "}
                            Adipisicing
                          </li>
                          <li className="leading-tight">
                            <i className="mdi mdi-check-bold text-lg"></i> Much
                            more...
                          </li>
                        </ul>
                      </div>
                      <div className="w-full">
                        <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                          Upgrade Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProAccount;
