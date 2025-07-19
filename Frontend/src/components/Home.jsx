import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import "./home.css";
const Home = () => {
  return (
    <div className="relative h-screen overflow-hidden bg-primary-dark text-white flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-10 gap-10">
      {/* Left Text Content */}
      {/* 🔁 Rotating Background Circle */}
      <div className="absolute -left-40 top-[20%] -translate-y-1/2 w-[600px] h-[600px] rounded-[100px] bg-red-50 border-4 border-blue-400 opacity-20 rotate-bg z-0"></div>

      {/* 🧠 Main Text Block */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 max-w-xl z-8 "
      >
        <h1 className="text-6xl  sm:text-7xl font-bold mb-6 leading-tight">
          Hey there, <span className="text-yellow-300">Harman</span> 👋
        </h1>
        <p className="text-2xl mb-4 text-yellow-200 font-semibold">
          <Typewriter
            words={["Web Developer", "Creative Thinker", "UI/UX Explorer"]}
            loop
            cursor
            cursorStyle="|"
            typeSpeed={70}
            deleteSpeed={40}
            delaySpeed={1500}
          />
        </p>
        <p className="text-lg text-gray-300 mb-6 ">
          Let’s see your tech journey! Dive into interactive, animated, and
          real-world inspired projects.
        </p>
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Projects
          </button>
          <button className="bg-transparent border border-blue-500 text-blue-400 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition">
            Contact
          </button>
        </div>
      </motion.div>
      <div className="flex-1 w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
        <div className="scale-[1.2] origin-center w-full h-full">
          <iframe
            src="https://my.spline.design/clonercubesimplecopy-XHxE717PmMydqfYRecLvHITQ"
            frameBorder="0"
            width="100%"
            height="100%"
            className="rounded-xl shadow-lg"
            allow="autoplay; fullscreen"
          ></iframe>
        </div>
      </div>

      <div className="bg-primary-dark w-[400px] h-[200px] absolute top-[60%] left-[65%] transform translate-x-1/2 translate-y-1/2"></div>
    </div>
  );
};

export default Home;
