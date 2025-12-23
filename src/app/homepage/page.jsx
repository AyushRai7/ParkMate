"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import logo from "../assets/logo.png";
import logo_name from "../assets/logo_name.png";
import main_img from "../assets/main_img1.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TypingEffect from "../typingeffect/page";
import FooterSection from "../footer/page";

export default function Home() {
  const router = useRouter();

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [ownerLoggedIn, setOwnerLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
    try {
      const res = await fetch("/api/tokencheck", {
        credentials: "include",
      });
      const data = await res.json();

      setUserLoggedIn(data.userLoggedIn);
      setOwnerLoggedIn(data.ownerLoggedIn);
    } catch (err) {
      console.error(err);
    } //finally {
    //   setLoading(false);
    // }
  };

  checkAuth();
  }, []);

  const getCookie = (name) => {
    if (typeof document === "undefined") return null;
    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return match ? match.split("=")[1] : null;
  };

  const handleUserAuth = async () => {
    if (userLoggedIn) {
      try {
        const res = await fetch("/api/logout", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          toast.warning("Logged out", { autoClose: 2000 });
          setUserLoggedIn(false);
          router.push("/login");
        } else {
          toast.error("Logout failed");
        }
      } catch (err) {
        toast.error("Error during logout");
      }
    } else {
      router.push("/login");
    }
  };

  const handleAdmin = () => {
    if (ownerLoggedIn) {
      router.push("/owner");
    } else {
      router.push("/ownerlogin");
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
          <Link
            href="#about"
            onClick={handleScroll}
            aria-label="Go to About Section"
          >
            About
          </Link>
          <button
            onClick={handleUserAuth}
            className="bg-black hover:bg-red-600 text-white px-3 py-1 rounded-md"
          >
            {userLoggedIn ? "Logout" : "Login"}
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
          <div>
            <button
            onClick={() => {
              if (userLoggedIn) {
                router.push("/booking");
              } else {
                router.push("/login");
              }
            }}
            className="bg-black hover:bg-red-600 text-white 
    px-4 py-2 rounded-md 
    text-lg md:text-xl mt-4 mx-auto md:mx-0"
          >
            Book Spot
          </button>
          </div>
          
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
            An average car driver spends upto 19 mins in finding a parking in a
            metro city.
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
      <FooterSection />
    </div>
  );
}
