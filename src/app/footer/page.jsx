import React from 'react'
import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.png";
import footer_logo_name from "../assets/footer_logo_name.png";

const FooterSection = () => {

  return (
    <div className="w-full mt-12">
    <div className="flex flex-col md:flex-row bg-gray-200 justify-between border-t-4 border-blue-900 w-full p-6 md:p-9 gap-8">
        <div className="flex flex-col md:ml-10 mt-2">
          <div className="flex mb-5 items-center">
            <Image
              src={logo}
              alt="Parking System Logo"
              className="w-auto h-12 md:h-16 object-contain"
              priority
            />
            <Image
              src={footer_logo_name}
              alt="Logo Name"
              className="w-auto h-10 md:h-12 object-contain ml-4"
              priority
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
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
            <div className="w-full md:w-[40%] flex justify-center md:justify-evenly mr-0 md:mr-4 gap-4">
              <Link
                href="https://www.instagram.com/ayush_rai077/"
                target="_blank"
              >
                <Image src="/insta.png" alt="Insta" width={20} height={20} />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ayush-rai-271985291/"
                target="_blank"
              >
                <Image
                  src="/linkdin.png"
                  alt="LinkedIn"
                  width={20}
                  height={20}
                />
              </Link>
              <Link href="https://github.com/AyushRai7" target="_blank">
                <Image src="/github.png" alt="GitHub" width={20} height={20} />
              </Link>
            </div>
          </div>
        </div>

        <div>
          <h3
            className="ml-2 text-sm font-semibold"
            style={{
              fontFamily: "Raleway, sans-serif",
              color: "rgb(34, 34, 34)",
            }}
          >
            WHERE TO FIND
          </h3>
          <Link
            href="https://www.google.com/maps/search/?api=1&query=IIIT+Kota+Permanent+Campus,Ranpur,Kota,Rajasthan-325003"
            target="_blank"
            className="hover:text-red-700 ml-2"
          >
            <p className="ml-2 cursor-pointer">IIIT KOTA, Ranpur,</p>
            <p className="ml-2 cursor-pointer">Kota, Rajasthan-325003</p>
          </Link>
        </div>

        <div>
          <h3
            className="ml-2 text-sm font-semibold"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
            }}
          >
            CONTACT US
          </h3>
          <p className="mt-4 mb-2 hover:text-red-700 cursor-pointer ml-2">
            +91-9717835155
          </p>
          <Link href="mailto:ayushrai1729@gmail.com">
            <p className="hover:text-red-700 cursor-pointer ml-2">
              ayushrai1729@gmail.com
            </p>
          </Link>
        </div>

        <div>
          <h3
            className="ml-2 text-sm font-semibold"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
            }}
          >
            DISCOVER
          </h3>
          <div
            className="flex flex-col ml-2 mb-4 mr-8 text-sm"
            style={{
              fontFamily: "Nunito Sans, sans-serif",
              color: "rgb(34, 34, 34)",
            }}
          >
            <Link href="/" className="mt-4 mb-2 hover:text-red-700">
              Home
            </Link>
            <Link
              href="#"
              className="mb-2 hover:text-red-700"
            >
              About Parkmate
            </Link>
            <Link href="/" className="mb-2 hover:text-red-700">
              Contact Us
            </Link>
            <Link href="/" className="hover:text-red-700">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>

      <div
        className="flex justify-center bg-gray-200 text-xs md:text-sm font-medium text-center py-2"
        style={{ fontFamily: "Raleway, sans-serif", color: "rgb(34, 34, 34)" }}
      >
        All Copyrights Reserved By Parkmate 2026
      </div>
    </div>
  )
}

export default FooterSection