"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import logo_name from "../assets/logo_name.png";
import main_img from "../assets/main_img1.png";
import TypingEffect from "../typingeffect/page";
import FooterSection from "../footer/page";

export default function Home() {
  const router = useRouter();

  const handleSignup = () => {
    router.push("/login");
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
            top: window.scrollY + rect.bottom - window.innerHeight + 20,
            behavior: "smooth",
          });
        }
      }, 500);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center p-3 mt-2">
        <div className="ml-0 md:ml-12 mix-blend-overlay flex">
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
        >
          <Link href="/" aria-label="Go to Home Page">
            Home
          </Link>
          <Link
            href="#about"
            aria-label="Go to About Page"
            onClick={handleScroll}
          >
            About
          </Link>
          <button
            onClick={handleSignup}
            className="bg-black hover:bg-red-600 text-white px-3 py-1 rounded-md"
          >
            Login
          </button>
          <Link href="/ownerlogin">
            <button className="bg-white outline text-black px-3 py-1 rounded-md hover:outline-red-600">
              Admin
            </button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-0">
        <div
          className="flex flex-col mt-10 md:mt-32 md:ml-32 relative 
             text-center md:text-left w-full md:w-1/2"
        >
          <div>
            <div className="absolute hidden md:flex left-[-40px] top-4 flex-row">
              <div className="w-1 h-24 bg-blue-900"></div>
              <div className="w-1 h-24 bg-red-600 ml-3 mt-5"></div>
            </div>

            <div>
              <h1
                className="text-3xl md:text-7xl mb-1 mt-4 md:mt-8"
                style={{
                  fontFamily: "Raleway, sans-serif",
                  color: "rgb(13, 14, 62)",
                }}
              >
                You <span className="text-red-600">D</span>rive,
              </h1>

              <h1
                className="text-3xl md:text-7xl"
                style={{
                  fontFamily: "Raleway, sans-serif",
                  color: "rgb(13, 14, 62)",
                }}
              >
                We <span className="text-red-600">P</span>ark.
              </h1>
            </div>
          </div>

          <div className="text-[1rem] md:text-[2rem]">
            <TypingEffect />
          </div>

          <Link href="/login">
            <button
              className="bg-black hover:bg-red-600 text-white 
                 px-4 py-2 rounded-md 
                 text-lg md:text-xl mt-4 mx-auto md:mx-0"
            >
              Book Spot
            </button>
          </Link>
        </div>

        <div className="mt-10 md:mt-28 w-full md:w-[640px] flex justify-center md:justify-end">
          <Image
            src={main_img}
            alt="Parking System"
            width={640}
            height={590}
            className="w-[90%] md:w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* About Section */}
      <div
        className="flex justify-center items-center mb-9 mt-20 md:mt-36 px-4"
        id="about-section"
      >
        <div className="w-full md:w-[70%] border-spacing-1 rounded-md px-5 md:px-20 py-6 md:py-11 shadow-md relative">
          <div className="flex flex-row my-6">
            <div className="flex flex-row">
              <div className="w-1 h-8 md:h-10 bg-blue-900"></div>
              <div className="w-1 h-8 md:h-10 bg-red-600 ml-2 mt-2 md:mt-3"></div>
            </div>
            <div className="ml-3 mt-1 md:mt-2">
              <h1 className="text-2xl md:text-4xl mb-6">
                What's Park<span className="text-red-600">M</span>ate?
              </h1>
            </div>
          </div>
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
      </div>

      {/* Quote Section */}
      <div className="p-5 mt-20 md:mt-40 mb-10 md:mb-28 flex justify-center items-center bg-[url('/bg-quote.png')] bg-no-repeat bg-center md:bg-[170px_top]">
        <div className="w-full md:w-[60%] flex justify-center items-center flex-col">
          <h3
            className="text-lg md:text-4xl font-mono italic mt-3 text-center"
            style={{
              fontFamily: "Raleway, sans-serif",
              color: "rgb(13, 14, 62)",
            }}
          >
            An average car driver spends up to 19 mins in finding a parking in a
            metro city.
          </h3>
          <div className="w-full flex justify-end mt-5">
            <h1
              className="italic text-sm md:text-xl text-right"
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

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
