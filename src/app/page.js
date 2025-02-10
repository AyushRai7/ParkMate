"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "./assets/logo.png";
import footer_logo_name from "./assets/footer_logo_name.png";
import logo_name from "./assets/logo_name.png";
import main_img from "./assets/main_img1.png";

export default function Home() {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about-section");
    
    if (aboutSection) {
      const yOffset = -100; // Adjust based on your fixed header height
      const y = aboutSection.getBoundingClientRect().top + window.scrollY + yOffset;
  
      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
  
      // Check if it's fully visible after scrolling
      setTimeout(() => {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          window.scrollTo({
            top: window.scrollY + rect.bottom - window.innerHeight + 20, // Small extra scroll
            behavior: "smooth"
          });
        }
      }, 500); // Wait for the first scroll to complete
    }
  };
  
  
  

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
        className="my-6 text-xs text-gray-700 font-raleway"
        style={{
          fontSize: "2rem",
          marginTop: "25px",
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

  return (
    <div>
      <header className="flex justify-between items-center p-3 mt-2">
        <div className="ml-12 mix-blend-overlay flex">
          <Image
            src={logo}
            alt="Parking System Logo"
            width={50}
            height={40}
            style={{ objectFit: "contain", maxHeight: "50px" }}
            priority
          />
          <div className="flex justify-center items-center">
            <Image
              src={logo_name}
              alt="Logo Name"
              width={180}
              height={5}
              style={{ objectFit: "contain", maxHeight: "20px" }}
              priority
            />
          </div>
        </div>
        <nav
          className="w-[30%] mr-14 flex justify-evenly items-center font-raleway text-xl"
          style={{
            fontFamily: "Nunito Sans, sans-serif",
            color: "rgb(13, 14, 62)",
          }}
        >
          <Link href="/" aria-label="Go to Home Page">
            Home
          </Link>
          <Link href="#" aria-label="Go to About Page" onClick={handleScroll}>
            About
          </Link>
          <button
            onClick={handleSignup}
            className="bg-black hover:bg-red-600 text-white px-3 py-1 rounded-md"
            aria-label="Logout"
          >
            SignUp
          </button>
          <Link href="/signup">
            <button className="bg-white outline text-black px-3 py-1 rounded-md hover:outline-red-600">
              Admin
            </button>
          </Link>
        </nav>
      </header>

      <div className="flex justify-between">
        <div className="flex justify-between">
          <div className="flex flex-col mt-32 ml-32 relative">
            {/* Two vertical lines */}
            <div className="absolute left-[-40px] top-4 flex flex-row">
              <div className="w-1 h-24 bg-blue-900"></div>
              <div className="w-1 h-24 bg-red-600 ml-3 mt-5"></div>
            </div>

            {/* Text Content */}
            <h1
              className="text-7xl mb-3 mt-8"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              You <span className="text-red-600">D</span>rive,
            </h1>
            <h1
              className="text-7xl"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              We <span className="text-red-600">P</span>ark.
            </h1>

            <TypingEffect />

            <Link href="/signup">
              <button className="bg-black hover:bg-red-600 text-white px-3 py-1 rounded-md text-xl mt-4">
                Book Spot
              </button>
            </Link>
          </div>
        </div>

        <div className="mr-14 mt-28">
          <Image
            src={main_img}
            alt="Parking System Logo"
            width={640}
            height={590}
            priority
          />
        </div>
      </div>

      <div className="flex justify-center items-center mb-9 mt-36"  id="about-section">
        <div className="w-[70%] border-spacing-1 rounded-md px-20 py-11 shadow-md relative">
          {/* Vertical lines inside the box */}
          <div className="flex flex-row my-6">
            <div className="flex flex-row">
              <div className="w-1 h-10 bg-blue-900"></div>
              <div className="w-1 h-10 bg-red-600 ml-2 mt-3"></div>
            </div>

            {/* Text Content */}
            <div className="ml-3 mt-2">
              <h1 className="text-4xl mb-6">
                What's Park<span className="text-red-600">M</span>ate?
              </h1>
            </div>
          </div>

          <div>
            <p
              className="text-2xl font-normal"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              ParkMate is a Smart Parking Solution that gives a seamless parking
              experience to the user and businesses. With ParkMate application,
              you will never have to search for or even visit a parking.
            </p>
            <br />
            <p
              className="text-2xl"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              Simply tell us where you want to go and we will handle the parking
              for you. With ParkMate, You drive. We Park.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 mt-40 mb-28 flex justify-center items-center bg-[url('/bg-quote.png')] bg-no-repeat bg-[170px_top]">
        <div className=" w-[60%] flex justify-center items-center flex-col">
          <div>
            <h3
              className="text-4xl font-mono italic mt-3"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              An average car driver spends upto 19 mins in finding a parking in
              a metro city.
            </h3>
          </div>

          <div className="flex justify-end mt-5">
            <h1
              className="italic text-xl"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              - IBM survey
            </h1>
          </div>
        </div>
      </div>

      <div className="flex bg-gray-200 justify-between border-t-4 border-blue-900 w-full p-9">
        <div className="flex flex-col ml-10 mt-2">
          <div className="flex mb-5">
            <div className="flex justify-center items-center">
              <Image
                src={logo}
                alt="Parking System Logo"
                className="w-auto h-16 object-contain"
                priority
              />
            </div>

            {/* Footer Logo Name */}
            <div className="flex justify-center items-center ml-4">
              <Image
                src={footer_logo_name}
                alt="Logo Name"
                className="w-auto h-12 object-contain"
                priority
              />
            </div>
          </div>
          {/* Logo */}

          <div className="flex justify-between">
            <h4
              className="ml-2"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(34, 34, 34)",
                fontWeight: "490",
              }}
            >
              FOLLOW US ON{" "}
            </h4>
            <div className="w-[40%] flex justify-evenly mr-4">
              <Link
                href="https://www.instagram.com/ayush_rai077/"
                target="_blank"
              >
                <Image
                  src="/insta.png"
                  alt="Description"
                  width={20}
                  height={20}
                />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ayush-rai-271985291/"
                target="_blank"
              >
                <Image
                  src="/linkdin.png"
                  alt="Description"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="https://github.com/AyushRai7" target="_blank">
                <Image
                  src="/github.png"
                  alt="Description"
                  width={20}
                  height={20}
                />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <div className="flex flex-row">
              <div className="w-1 h-5 bg-red-600"></div>
            </div>
            <h3
              className="ml-2 text-xm font-semibold"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(34, 34, 34)",
              }}
            >
              WHERE TO FIND
            </h3>
          </div>

          <div
            className="ml-2 text-xm"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
              fontWeight: "500",
            }}
          >
            <Link
              href="https://www.google.com/maps/search/?api=1&query=IIIT+Kota+Permanent+Campus,Ranpur,Kota,Rajasthan-325003"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-700"
            >
              <p className="mt-4 cursor-pointer">IIIT KOTA, Ranpur,</p>
              <p>Kota, Rajasthan-325003</p>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <div className="flex flex-row">
              <div className="w-1 h-5 bg-red-700"></div>
            </div>
            <h3
              className="ml-2 text-xm font-semibold"
              style={{
                fontFamily: "Nunito Sans, sans-serif",
                color: "rgb(34, 34, 34)",
              }}
            >
              CONTACT US
            </h3>
          </div>

          <div className="ml-2">
            <p className="mt-4 mb-2 hover:text-red-700 cursor-pointer">
              +91-9717835155
            </p>
            <Link href="http://mail.google.com">
              <p className="hover:text-red-700 cursor-pointer">
                ayushrai1729@gmail.com
              </p>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center">
            <div className="flex flex-row">
              <div className="w-1 h-5 bg-red-700"></div>
            </div>
            <h3
              className="ml-2 text-xm font-semibold"
              style={{
                fontFamily: "Nunito Sans, sans-serif",
                color: "rgb(34, 34, 34)",
              }}
            >
              DISCOVER
            </h3>
          </div>

          <div
            className="flex flex-col ml-2 mb-4 mr-8 text-xm"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
            }}
          >
            <Link
              href="/"
              aria-label="Go to Home Page"
              className="mt-4 mb-2 hover:text-red-700"
            >
              Home
            </Link>
            <Link
              href="#"
              aria-label="Go to Home Page"
              className="mb-2 hover:text-red-700"
              onClick={handleScroll}
            >
              About Parkmate
            </Link>
            <Link
              href="/"
              aria-label="Go to Home Page"
              className="mb-2 hover:text-red-700"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              aria-label="Go to Home Page"
              className="hover:text-red-700"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
      <div
        className="flex justify-center bg-gray-200 text-xm font-medium"
        style={{
          fontFamily: "Raleway, sans-serif",
          color: "rgb(34, 34, 34)",
        }}
      >
        All Copyrights Reserved By Parkmate 2024
      </div>
    </div>
  );
}
