import { useState, useEffect, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Banner from "./components/Banner.jsx";
import Footer from "./components/Footer.jsx";
import ContentSection from "./components/ContentSection.jsx";
import { navigation, stats, features } from "./index.js";
import "../styles/landingstyles.css";
const containerVariants = {
  hidden: { opacity: 1, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// Variants für die Animationen
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};

const statVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
      duration: 1,
    },
  },
};

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove the token from LocalStorage
    localStorage.removeItem("userToken");
    setIsLoggedIn(false); // Update the isLoggedIn state
    navigate("/");
  };

  return (
    <div className="relative flex flex-col h-full items-center justify-center   transition-bg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="jumbo absolute -inset-[10px] opacity-50"></div>
      </div>
      <div className="relative min-h-screen  w-screen antialiased bg-transparent">
        <div className="bg-transparent h-screen ">
          <header className="absolute inset-x-0 top-0 ">
            <Banner />

            <nav
              className="flex items-center justify-between  lg:px-8"
              aria-label="Global"
            >
              <div className="flex lg:flex-1">
                <Link to="/" className="-m-1.5 p-1.5 z-10">
                  <span className="sr-only">WebDesk:</span>
                  <img
                    className="h-full w-full "
                    src="https://cdn.discordapp.com/attachments/1185665614086426674/1194230093527130162/WebDesk__2___1_-removebg-preview.png?ex=65af9872&is=659d2372&hm=b5514c628bb56612b2ad214dcb0efa6b97cb88f5f264d187f528d993b121eb1d&"
                    alt=""
                  />
                </Link>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className=" inline-flex items-center justify-center rounded-md p-2.5 text-luckyPoint-700"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="hidden lg:flex lg:gap-x-12 z-10">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-black"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end z-10">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold leading-6 text-black"
                  >
                    Logout
                  </button>
                ) : (
                  <a
                    href="/auth"
                    className="text-sm font-semibold leading-6 text-black"
                  >
                    Log in <span aria-hidden="true">&rarr;</span>
                  </a>
                )}
              </div>
            </nav>
            <Dialog
              as="div"
              className="lg:hidden"
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
            >
              <div className="fixed inset-0 z-50" />
              <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto  px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-luckyPoint-900/10">
                <div className="flex items-center justify-between">
                  <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">WebDesk</span>
                    <img
                      className="h-32 w-32"
                      src="https://cdn.discordapp.com/attachments/1185665614086426674/1194230093527130162/WebDesk__2___1_-removebg-preview.png?ex=65af9872&is=659d2372&hm=b5514c628bb56612b2ad214dcb0efa6b97cb88f5f264d187f528d993b121eb1d&"
                      alt=""
                    />
                  </a>
                  <button
                    type="button"
                    className="-m-2.5 rounded-md p-2.5 text-black"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-black hover:bg-luckyPoint-50"
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                    <div className="py-6">
                      <div className="py-6">
                        <Link
                          to="/auth"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-black hover:bg-luckyPoint-100 "
                        >
                          Log in
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </header>

          <div className="relative isolate px-6 pt-14 lg:px-8 ">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
              {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/60">
                Announcing our next round of funding.{" "}
                <a href="/" className="font-semibold text-luckyPoint-600">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div> */}
              <div className="relative flex flex-col justify-center  overflow-hidden">
                <div className="w-full max-w-5xl mx-auto px-4 md:px-6 py-16">
                  <div className="text-center space-y-20">
                    <h1 className="relative flex items-center  text-6xl md:text-9xl font-extrabold text-black  dark:opacity-80 transition-colors">
                      web
                      <span className="ml-1 rounded-xl bg-black p-2 text-[0.7em] leading-none">
                        <span className="  text-6xl md:text-9xl font-extrabold bg-clip-text  text-transparent bg-[linear-gradient(to_right,#818cf8,#e0e7ff,#38bdf8,#e879f9,#38bdf8,#e0e7ff,#818cf8)] bg-[length:200%_auto] animate-gradient">
                          DESK:
                        </span>
                      </span>
                    </h1>
                  </div>
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-black sm:text-6xl">
                  Revolutionize Your Team Collaboration
                </h2>
                <p className="mt-6 text-lg leading-8 text-slate-500">
                  Integrate video chats, collaborative workspaces, and direct
                  GitHub repository access in one seamless platform
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <a
                    href="/auth"
                    className="rounded-md bg-luckyPoint-700 px-3.5 py-2.5 text-sm font-semibold text-luckyPoint-100 shadow-sm hover:bg-luckyPoint-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-luckyPoint-600"
                  >
                    Get started
                  </a>
                  <a
                    href="/"
                    className="text-sm font-semibold leading-6 text-black"
                  >
                    See Demo <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-full -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-full"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-100 py-24 sm:py-32 lg:h-screen sm:h-full ogradient">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 1.0 }}
              >
                <h2 className="text-base font-semibold leading-7 text-luckyPoint-600">
                  Streamline Your Workflow with Advanced Deployment Features
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-black sm:text-4xl">
                  WebDesk simplifies app deployment, making it faster and more
                  efficient.
                </p>
              </motion.div>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
              <motion.dl
                className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 1.0 }} // Startet die Animation, wenn das Element zu 100% im Viewport ist
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    variants={itemVariants}
                    className="relative"
                  >
                    <div
                      className="flex items-center absolute left-0 top-0 h-full"
                      style={{ "--accent-color": feature.accentColor }}
                    >
                      <div className="h-full w-16 flex items-center justify-center rounded-lg bg-luckyPoint-600">
                        <div className="rounded-md h-10 w-10 shadow-md bg-luckyPoint-700 flex justify-center items-center">
                          <feature.icon
                            className="h-6 w-6 text-luckyPoint-200"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="pl-24 shadow-md rounded-md p-4 bg-white">
                      <div className="flex items-center">
                        <div
                          className="h-full w-4"
                          style={{ backgroundColor: feature.accentColor }}
                        ></div>
                        <div className="h-full w-16 flex items-center justify-center rounded-md">
                          <feature.icon
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                          />
                        </div>
                        <div
                          className="h-full w-4"
                          style={{ backgroundColor: feature.accentColor }}
                        ></div>
                      </div>
                      <dt className="text-base font-semibold leading-7 text-gray-900 mt-2">
                        {feature.name}
                      </dt>
                      <dd className="mt-2 text-base leading-7 text-slate-500">
                        {feature.description}
                      </dd>
                    </div>
                  </motion.div>
                ))}
              </motion.dl>
            </div>
          </div>
        </div>
        <div className="relative">
          <ContentSection />
        </div>
        <div className="relative isolate overflow-hidden bg-luckyPoint-900 p-16">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"
            alt=""
            className="absolute inset-0 -z-10 h-full w-full object-cover md:object-top sm:object-bottom"
          />

          <div
            className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-full bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
            aria-hidden="true"
          >
            <div
              className="aspect-[1097/845] w-full bg-gradient-to-tr from-[#ff4694] to-[#776fff] opacity-20"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8  lg:max-w-none  h-screen">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <motion.h2
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                className="text-4xl font-bold tracking-tight text-luckyPoint-200 sm:text-6xl"
              >
                All-in-One Collaboration Hub
              </motion.h2>
              <p className="mt-6 text-lg leading-8 text-luckyPoint-200">
                Connect with your team anywhere, anytime. Customizable spaces to
                bring your projects to life. Direct access to your repositories
                for streamlined development. Collaborate on documents, code, and
                more in real time.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
              <motion.dl
                className="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"
                variants={statVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
              >
                {stats.map((stat) => (
                  <div key={stat.name} className="flex flex-col-reverse">
                    <dt className="text-base leading-7 text-gray-600">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-bold leading-9 tracking-tight text-luckyPoint-200">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </motion.dl>
            </div>
            <div className="bg-transparent mt-16 px-6 lg:px-8">
              <div className="max-w-6xl mx-auto text-white py-10 sm:py-12 lg:py-16">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl mb-3">
                    Soon available on mobile devices!
                  </h3>
                  <div className="flex flex-wrap justify-center my-10 gap-4">
                    <div className="flex items-center border w-52 rounded-lg px-4 py-2 mx-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                        alt="footer_alt"
                        className="w-7 md:w-8"
                      />
                      <div className="text-left ml-3">
                        <p className="text-xs text-gray-200">Soon at </p>
                        <p className="text-sm md:text-base">
                          Google Play Store
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center border w-52 rounded-lg px-4 py-2 mx-2">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                        alt="footer"
                        className="w-7 md:w-8"
                      />
                      <div className="text-left ml-3">
                        <p className="text-xs text-gray-200">Soon at </p>
                        <p className="text-sm md:text-base"> Apple Store </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div className="relative mt-40">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
