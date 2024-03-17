import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import Button from "./Button";
import { generateFromTemplate } from "@/lib/generateFromTemplate";

const Navbar = ({ toggle }: { toggle: () => void }) => {
  return (
    <>
      <div className="w-full h-15 bg-black sticky top-0 p-2">
        <div className="container mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Logo />
            <button
              type="button"
              className="inline-flex items-center md:hidden"
              onClick={toggle}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#fff"
                  d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2Z"
                />
              </svg>
            </button>
            <ul className="hidden md:flex gap-x-6 text-white ">
              <li>
                {/* <Link href="/dashboard">
                  <p style={{ backgroundColor: "#85086E", padding: 5 }}>
                    Go to Editor
                  </p>
                </Link> */}
              </li>
              <li>
                <Link
                  href="/about"
                  onClick={() =>
                    generateFromTemplate(
                      "../circuits/crop/src/main.nr.template",
                      {
                        content_size: "10",
                        old_content_size: "10",
                        last_op_args: "0",
                      }
                    )
                  }
                >
                  {/* <p>About Us</p> */}
                </Link>
              </li>
            </ul>
            {/* <div className="hidden md:block">
              <Button />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
