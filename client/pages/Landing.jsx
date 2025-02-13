import { useState, useEffect } from "react";

function Landing() {
  const fullText = "Connecting businesses with creative talent seamlessly"; // Updated text
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const typingSpeed = 100; // Speed of typing
  const delayBeforeReset = 2000; // 2-second delay before restarting

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(fullText.slice(0, index + 1));
        setIndex(index + 1);
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => {
        setText("");
        setIndex(0);
      }, delayBeforeReset);
    }
  }, [index]);

  return (
    <div className="min-h-screen bg-[#0F1116] relative flex flex-col items-center justify-center text-white">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>

      {/* Content */}
      <div className="z-10 text-center max-w-2xl">
        {/* Typewriter Title */}
        <h1 className="text-4xl sm:text-5xl font-semibold mb-4 min-h-[64px]">
          {text}
          <span className="animate-blink">|</span>
        </h1>

        <p className="text-gray-400 text-lg mb-6">
          ArtfulWay ensures fair project matching, quality assurance, and AI-driven marketing tools to empower both artists and businesses.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition">
            Explore Projects
          </button>
          <button className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-md hover:bg-gray-200 transition">
            Join as an Artist
          </button>
        </div>
      </div>
    </div>
  );
}

export default Landing;
