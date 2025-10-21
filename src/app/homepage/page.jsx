"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import footer_logo_name from "../assets/footer_logo_name.png";
import logo_name from "../assets/logo_name.png";
import main_img from "../assets/main_img1.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();

  const handleAdmin = () => {
    console.log("Cookies:", document.cookie); // Debug
    const tokenExists = document.cookie.includes("ownerToken");
    console.log("Token exists?", tokenExists);
    if (tokenExists) {
      router.push("/owner");
    } else {
      router.push("/ownerlogin");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        toast.warning("Successfully logged out", { autoClose: 2000 });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error("Logout failed", { autoClose: 2000 });
        console.error("Logout failed");
      }
    } catch (error) {
      toast.error("Error in Logout", { autoClose: 2000 });
      console.error("Error logging out:", error);
    }
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about-section");

    if (aboutSection) {
      const yOffset = -100;
      const y =
        aboutSection.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      setTimeout(() => {
        const rect = aboutSection.getBoundingClientRect();
        if (rect.bottom > window.innerHeight) {
          window.scrollTo({
            top: window.scrollY + rect.bottom - window.innerHeight + 20, // Small extra scroll
            behavior: "smooth",
          });
        }
      }, 500);
    }
  };

  const TypingEffect = () => {
      const sentences = [
        "At your service, Anytime and Anywhere",
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
      <ToastContainer position="top-right" />
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-3 mt-2">
        <div className="ml-0 md:ml-12 mix-blend-overlay flex items-center">
          <Image
            src={logo}
            alt="Parking System Logo"
            width={50}
            height={40}
            style={{ objectFit: "contain", maxHeight: "50px" }}
            priority
          />
          <div className="flex justify-center items-center ml-2">
            <Image
              src={logo_name}
              alt="Logo Name"
              width={140}
              height={5}
              style={{ objectFit: "contain", maxHeight: "20px" }}
              priority
            />
          </div>
        </div>
        <nav
          className="w-full md:w-[30%] mt-4 md:mt-0 mr-0 md:mr-14 flex flex-wrap md:flex-nowrap justify-center md:justify-evenly items-center gap-3 font-raleway text-base md:text-xl"
          style={{
            fontFamily: "Nunito Sans, sans-serif",
            color: "rgb(13, 14, 62)",
          }}
          aria-label="Primary Navigation"
        >
          <Link href="/homepage" aria-label="Go to Home Page">
            Home
          </Link>
          <Link href="#about" onClick={handleScroll} aria-label="Go to About Section">
            About
          </Link>
          <button
            onClick={handleLogout}
            className="bg-black hover:bg-red-600 text-white px-3 py-1 rounded-md"
            aria-label="Logout"
          >
            Logout
          </button>
          <button
            className="bg-white outline text-black px-3 py-1 rounded-md hover:outline-red-600"
            onClick={handleAdmin}
            aria-label="Admin Access"
          >
            Admin
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row justify-between px-4 md:px-0">
        {/* Left Section */}
        <div className="flex flex-col mt-20 md:mt-32 ml-4 md:ml-32 relative max-w-full md:max-w-xl">
          {/* Two vertical lines */}
          <div className="absolute left-[-20px] md:left-[-40px] top-4 flex flex-row">
            <div className="w-1 h-20 md:h-24 bg-blue-900"></div>
            <div className="w-1 h-20 md:h-24 bg-red-600 ml-2 md:ml-3 mt-3 md:mt-5"></div>
          </div>

          {/* Headings */}
          <h1
            className="text-5xl md:text-7xl mb-3 mt-8"
            style={{
              fontFamily: "Raleway, sans-serif",
              color: "rgb(13, 14, 62)",
            }}
          >
            You <span className="text-red-600">D</span>rive,
          </h1>
          <h1
            className="text-5xl md:text-7xl"
            style={{
              fontFamily: "Raleway, sans-serif",
              color: "rgb(13, 14, 62)",
            }}
          >
            We <span className="text-red-600">P</span>ark.
          </h1>

          <TypingEffect />

          <Link href="/booking">
            <button className="bg-black hover:bg-red-600 text-white px-3 py-1 rounded-md text-lg md:text-xl mt-4 max-w-max">
              Book Spot
            </button>
          </Link>
        </div>

        {/* Right Section - Image */}
        <div className="mr-0 md:mr-14 mt-10 md:mt-28 w-full md:w-[640px] flex justify-center">
          <Image
            src={main_img}
            alt="Parking System Logo"
            width={640}
            height={590}
            className="w-full h-auto"
            priority
          />
        </div>
      </main>

      {/* About Section */}
      <section
        id="about-section"
        className="flex justify-center items-center mb-9 mt-20 md:mt-36 px-4 md:px-0"
      >
        <div className="w-full md:w-[70%] border-spacing-1 rounded-md px-5 md:px-20 py-6 md:py-11 shadow-md relative">
          {/* Vertical lines inside the box */}
          <div className="flex flex-row my-6">
            <div className="flex flex-row">
              <div className="w-1 h-8 md:h-10 bg-blue-900"></div>
              <div className="w-1 h-8 md:h-10 bg-red-600 ml-2 mt-2 md:mt-3"></div>
            </div>

            {/* About title */}
            <div className="ml-3 mt-1 md:mt-2">
              <h1 className="text-2xl md:text-4xl mb-6">
                What's Park<span className="text-red-600">M</span>ate?
              </h1>
            </div>
          </div>

          {/* About text content */}
          <div>
            <p
              className="text-lg md:text-2xl font-normal"
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
              className="text-lg md:text-2xl"
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
        </section>

      {/* Quote Section */}
      <section className="p-5 mt-20 md:mt-40 mb-10 md:mb-28 flex justify-center items-center bg-[url('/bg-quote.png')] bg-no-repeat bg-center md:bg-[170px_top] px-4 md:px-0">
        <div className="w-full md:w-[60%] flex justify-center items-center flex-col text-center">
          <p
            className="text-xl md:text-4xl font-thin italic"
            style={{
              fontFamily: "Raleway, sans-serif",
              color: "rgb(13, 14, 62)",
            }}
          >
            An average car driver spends upto 19 mins in finding a parking in a metro city.
          </p>

          <div className="w-full flex justify-end mt-5">
            <h1
              className="italic text-base md:text-xl text-right"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(13, 14, 62)",
              }}
            >
              - IBM survey
            </h1>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row bg-gray-200 justify-between border-t-4 border-blue-900 w-full p-6 md:p-9">
        {/* Logo and Social */}
        <div className="flex flex-col md:ml-10 mt-2">
          <div className="flex mb-5">
            <div className="flex justify-center items-center">
              <Image
                src={logo}
                alt="Parking System Logo"
                className="w-auto h-12 md:h-16 object-contain"
                priority
              />
            </div>

            <div className="flex justify-center items-center ml-4">
              <Image
                src={footer_logo_name}
                alt="Logo Name"
                className="w-auto h-10 md:h-12 object-contain"
                priority
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <h4
              className="ml-2 text-base md:text-lg font-semibold"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(34, 34, 34)",
                fontWeight: "490",
              }}
            >
              FOLLOW US ON
            </h4>
            <div className="w-full md:w-[40%] flex justify-center md:justify-evenly mr-0 md:mr-4 gap-4">
              <Link href="https://www.instagram.com/ayush_rai077/" target="_blank" aria-label="Instagram">
                <Image src="/insta.png" alt="Instagram Icon" width={20} height={20} />
              </Link>
              <Link href="https://www.linkedin.com/in/ayush-rai-271985291/" target="_blank" aria-label="LinkedIn">
                <Image src="/linkdin.png" alt="LinkedIn Icon" width={20} height={20} />
              </Link>
              <Link href="https://github.com/AyushRai7" target="_blank" aria-label="GitHub">
                <Image src="/github.png" alt="GitHub Icon" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>

        {/* Where To Find */}
        <div>
          <div className="flex items-center">
            <div className="w-1 h-5 bg-red-600"></div>
            <h3
              className="ml-2 text-sm md:text-base font-semibold"
              style={{
                fontFamily: "Raleway, sans-serif",
                color: "rgb(34, 34, 34)",
              }}
            >
              WHERE TO FIND
            </h3>
          </div>

          <div
            className="ml-2 text-sm md:text-base font-medium"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
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

        {/* Contact Us */}
        <div>
          <div className="flex items-center">
            <div className="w-1 h-5 bg-red-700"></div>
            <h3
              className="ml-2 text-sm md:text-base font-semibold"
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
            <Link href="mailto:ayushrai1729@gmail.com" className="hover:text-red-700 cursor-pointer">
              ayushrai1729@gmail.com
            </Link>
          </div>
        </div>

        {/* Discover */}
        <div>
          <div className="flex items-center">
            <div className="w-1 h-5 bg-red-700"></div>
            <h3
              className="ml-2 text-sm md:text-base font-semibold"
              style={{
                fontFamily: "Nunito Sans, sans-serif",
                color: "rgb(34, 34, 34)",
              }}
            >
              DISCOVER
            </h3>
          </div>

          <div
            className="flex flex-col ml-2 mb-4 mr-0 md:mr-8 text-sm md:text-base"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
            }}
          >
            <Link
              href="/homepage"
              aria-label="Go to Home Page"
              className="mt-4 mb-2 hover:text-red-700"
            >
              Home
            </Link>
            <Link
              href="#about"
              aria-label="Go to About Section"
              className="mb-2 hover:text-red-700"
              onClick={handleScroll}
            >
              About Parkmate
            </Link>
            <Link
              href="#contactus"
              aria-label="Go to Contact Section"
              className="mb-2 hover:text-red-700"
            >
              Contact Us
            </Link>
            <Link
              href="#termsandcondition"
              aria-label="Go to Terms and Conditions"
              className="hover:text-red-700"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </footer>

      <div
        className="flex justify-center bg-gray-200 text-xs md:text-sm font-medium p-2"
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
