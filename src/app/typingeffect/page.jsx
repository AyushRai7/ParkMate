"use client";
import React, { useState, useEffect } from 'react'

const TypingEffect = () => {
    const sentences = [
      "At your service, Anytime and Anywhere.",
      "Leave your Parking needs to us!",
    ];

    const [displayText, setDisplayText] = useState("");
    const [sentenceIndex, setSentenceIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
      const handleTyping = () => {
        const currentSentence = sentences[sentenceIndex];
        const isLastChar = charIndex === currentSentence.length;

        if (!isDeleting && !isLastChar) {
          setDisplayText(currentSentence.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else if (isDeleting && charIndex > 0) {
          setDisplayText(currentSentence.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else if (!isDeleting && isLastChar) {
          setTimeout(() => setIsDeleting(true), 1000);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setSentenceIndex((sentenceIndex + 1) % sentences.length);
        }
      };

      const typingSpeed = isDeleting ? 50 : 100;
      const typingDelay = isDeleting && charIndex === 0 ? 500 : typingSpeed;

      const timer = setTimeout(handleTyping, typingDelay);

      return () => clearTimeout(timer);
    }, [charIndex, isDeleting, sentenceIndex]);

    return (
      <div
        className="
      my-6 
      text-base md:text-3xl 
      text-gray-700 
      font-raleway
      mt-6
    "
        style={{
          fontFamily: "Nunito Sans, sans-serif",
          color: "rgb(13, 14, 62)",
        }}
      >
        {displayText.split(" ").map((word, index) => (
          <span
            key={index}
            className={
              ["Anytime", "Anywhere", "Parking"].includes(
                word.replace(/[.,]/g, "")
              )
                ? "font-medium"
                : ""
            }
          >
            {word}{" "}
          </span>
        ))}

        <span className="border-r-0 border-gray-700 animate-blink">&nbsp;</span>
      </div>
    );
  };

export default TypingEffect