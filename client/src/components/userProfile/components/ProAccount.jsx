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
      <div className="min-w-screen min-h-screen bg-gray-100 px-5 py-5">
        <div className="w-full mx-auto bg-white px-5 py-10 text-gray-900 mb-10">
          <div className="max-w-5xl mx-auto md:flex">
            <div className="md:w-1/4 md:flex md:flex-col">
              <div className="text-left w-full flex-grow md:pr-5">
                <h1 className="text-4xl font-bold mb-5">Pricing</h1>
                <h3 className="text-md font-medium mb-5">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit
                  repellat dignissimos laboriosam odit accusamus porro*
                </h3>
              </div>
              <div className="w-full mb-2">
                <p className="text-xs">*Lorem ipsum sit amet</p>
              </div>
            </div>
            <div className="md:w-3/4">
              <div className="max-w-4xl mx-auto md:flex">
                <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-2 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
                  <div className="w-full flex-grow">
                    <h2 className="text-center font-bold uppercase mb-4">
                      PERSONAL
                    </h2>
                    <h3 className="text-center font-bold text-4xl mb-5">
                      $5<span className="text-sm">/mo</span>
                    </h3>
                    <ul className="text-sm mb-8">
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Lorem
                        ipsum
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                        amet
                      </li>
                    </ul>
                  </div>
                  <div className="w-full">
                    <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                      Buy Now
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:-mx-3 md:mb-0 rounded-md shadow-lg shadow-gray-600 md:relative md:z-50 md:flex md:flex-col">
                  <div className="w-full flex-grow">
                    <h2 className="text-center font-bold uppercase mb-4">
                      TEAM
                    </h2>
                    <h3 className="text-center font-bold text-4xl md:text-5xl mb-5">
                      $15<span className="text-sm">/mo</span>
                    </h3>
                    <ul className="text-sm mb-8">
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Lorem
                        ipsum
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                        amet
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i>{" "}
                        Consectetur
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i>{" "}
                        Adipisicing
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Elit
                        repellat
                      </li>
                    </ul>
                  </div>
                  <div className="w-full">
                    <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                      Buy Now
                    </button>
                  </div>
                </div>
                <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-2 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
                  <div className="w-full flex-grow">
                    <h2 className="text-center font-bold uppercase mb-4">
                      PRO
                    </h2>
                    <h3 className="text-center font-bold text-4xl mb-5">
                      $35<span className="text-sm">/mo</span>
                    </h3>
                    <ul className="text-sm mb-8">
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Lorem
                        ipsum
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                        amet
                      </li>
                      <li className="leading-tight">
                        <i className="mdi mdi-check-bold text-lg"></i>{" "}
                        Consectetur
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
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto bg-white px-5 py-10 text-gray-900 mb-10">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-5">Pricing</h1>
            <h3 className="text-xl font-medium mb-10">
              Lorem ipsum dolor sit amet consectetur adipisicing elit repellat
              dignissimos laboriosam odit accusamus porro
            </h3>
          </div>
          <div className="max-w-4xl mx-auto md:flex">
            <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-6 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center font-bold uppercase mb-4">
                  PERSONAL
                </h2>
                <h3 className="text-center font-bold text-4xl mb-5">$5/mo</h3>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:-mx-3 md:mb-0 rounded-md shadow-lg shadow-gray-600 md:relative md:z-50 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center font-bold uppercase mb-4">TEAM</h2>
                <h3 className="text-center font-bold text-4xl md:text-5xl mb-5">
                  $15/mo
                </h3>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Consectetur
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Adipisicing
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Elit repellat
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/3 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-6 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center font-bold uppercase mb-4">PRO</h2>
                <h3 className="text-center font-bold text-4xl mb-5">$35/mo</h3>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Consectetur
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Adipisicing
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Much more...
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mx-auto bg-white px-5 py-10 text-gray-900 mb-10">
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-5">Pricing</h1>
            <h3 className="text-xl font-medium mb-10">
              Lorem ipsum dolor sit amet consectetur adipisicing elit repellat
              dignissimos laboriosam odit accusamus porro
            </h3>
          </div>
          <div className="w-full md:flex mb-5">
            <div className="w-full md:w-1/4 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-6 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center font-bold uppercase mb-4">
                  PERSONAL
                </h2>
                <h3 className="text-center font-bold text-4xl mb-2">
                  $5<span className="text-lg">/mo</span>
                </h3>
                <p className="text-center font-bold mb-5">
                  <a
                    href="#"
                    className="hover:underline hover:text-gray-700 transition-all transform hover:scale-110 inline-block"
                  >
                    Read more<i className="mdi mdi-arrow-right-thick ml-1"></i>
                  </a>
                </p>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/4 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:-mx-3 md:my-3 rounded-md shadow-lg shadow-gray-600 md:relative md:z-50 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center font-bold uppercase mb-4">TEAM</h2>
                <h3 className="text-center font-bold text-3xl md:text-4xl mb-2">
                  $15<span className="text-lg">/mo</span>
                </h3>
                <p className="text-center font-bold mb-5">
                  <a
                    href="#"
                    className="hover:underline hover:text-gray-700 transition-all transform hover:scale-110 inline-block"
                  >
                    Read more<i className="mdi mdi-arrow-right-thick ml-1"></i>
                  </a>
                </p>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Consectetur
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Adipisicing
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Elit repellat
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/4 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:-mx-3 md:mb-0 rounded-md shadow-lg shadow-gray-600 md:relative md:z-50 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center font-bold uppercase mb-4">PRO</h2>
                <h3 className="text-center font-bold text-4xl md:text-5xl mb-2">
                  $35<span className="text-lg">/mo</span>
                </h3>
                <p className="text-center font-bold mb-5">
                  <a
                    href="#"
                    className="hover:underline hover:text-gray-700 transition-all transform hover:scale-110 inline-block"
                  >
                    Read more<i className="mdi mdi-arrow-right-thick ml-1"></i>
                  </a>
                </p>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Consectetur
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Adipisicing
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Much more...
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Buy Now
                </button>
              </div>
            </div>
            <div className="w-full md:w-1/4 md:max-w-none bg-white px-8 md:px-10 py-8 md:py-10 mb-3 mx-auto md:my-3 rounded-md shadow-lg shadow-gray-600 md:flex md:flex-col">
              <div className="w-full flex-grow">
                <h2 className="text-center text-3xl font-bold uppercase mb-2">
                  ENTERPRISE
                </h2>
                <p className="text-center font-bold mb-5">
                  <a
                    href="#"
                    className="hover:underline hover:text-gray-700 transition-all transform hover:scale-110 inline-block"
                  >
                    Read more<i className="mdi mdi-arrow-right-thick ml-1"></i>
                  </a>
                </p>
                <ul className="text-sm px-5 mb-8">
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Lorem ipsum
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Consectetur
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Adipisicing
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Sed do
                    eiusmod
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Aliquip ex
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Excepteur
                  </li>
                  <li className="leading-tight">
                    <i className="mdi mdi-check-bold text-lg"></i> Dolor sit
                    amet*
                  </li>
                </ul>
              </div>
              <div className="w-full">
                <button className="font-bold bg-gray-600 hover:bg-gray-700 text-white rounded-md px-10 py-2 transition-colors w-full">
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
          <div className="text-center max-w-xl mx-auto">
            <p className="text-xs leading-tight">
              *Lorem ipsum dolor sit, amet consectetur adipisicing elit. Aliquam
              eligendi officiis, impedit ducimus eaque a corporis, dolore quia
              officia quam tenetur suscipit dolores, quos, quaerat quo provident
              iusto. Eius, impedit!
            </p>
          </div>
        </div>
      </div>

  

    </>
  );
};

export default ProAccount;
