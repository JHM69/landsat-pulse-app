"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  const satellites = [
    {
      name: "Landsat-8",
      description: "Exploring the world's forests, water, and land from space.",
      location:
        "Currently in a Sun-synchronous orbit (SSO) at an altitude of approximately 705 kilometers (438 miles) above the Earth’s surface.",
      longitude: 98.342334,
      latitude: 39.32098,
      image: "landsat-8.webp",
    },
    {
      name: "Landsat-9",
      description: "Exploring the outer reaches of the solar system.",
      location:
        "Currently in a Sun-synchronous orbit at an altitude of 705 km (438 mi), with an inclination of 98.2° and an orbital period of 99.0 minutes.",
      longitude: 97.342334,
      latitude: 38.32098,
      image: "landsat-9.webp",
    },
  ];

  return (
    <div className="bg-black">
      {/* Hero Section with Lottie Animation */}
      <div className="relative min-h-screen flex flex-col justify-center items-center text-center">
        {/* Lottie Animation */}
        <div className="absolute inset-0 z-0">
          <DotLottieReact src="land2.json" loop autoplay speed={1} />
        </div>

        {/* Overlay for Content */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-24 px-6">
          {/* Team Name */}
          <div className="space-y-2 mb-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Landsat Pulse
            </h1>
            {/* Subtitle / Short Description */}
            <p className="text-lg md:text-xl text-gray-400 italic max-w-xl">
              Exploring the Boundaries of Space and Time
            </p>
          </div>

          {/* CTA Button */}
          <div className="space-y-4 mt-24">
            <button
              onClick={() => router.push("/signin")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-8 rounded-full font-semibold text-lg transition duration-300 ease-in-out"
            >
              Join Us on the Journey
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="relative bg-gray-900 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            About Landsat Pulse
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            Landsat Pulse is a platform that allows you to explore the world's
            forests, water, and land from space. The satellites have been
            exploring the outer reaches of the solar system. Join us on our
            journey to the stars!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {satellites.map((satellite, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                {/* Image Section */}
                <div
                  className="w-full h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${satellite.image})`,
                  }}
                ></div>

                {/* Satellite Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-indigo-500 mb-2">
                    {satellite.name}
                  </h3>
                  <p className="text-gray-400 mb-4">{satellite.description}</p>
                  <p className="text-gray-300 font-semibold mb-2">
                    {satellite.location}
                  </p>
                  <div className="flex justify-around items-centersss mt-2">
                    <p className="text-gray-300">
                      Latitude: {satellite.latitude}
                    </p>
                    <p className="text-gray-300">
                      Longitude: {satellite.longitude}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-4 bg-black bg-opacity-70 text-gray-400 text-center">
        <p>
          &copy; 2024 Quantum Voyagers. All Rights Reserved. | Part of NASA
          Space Apps Challenge - Bangladesh 2024
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
