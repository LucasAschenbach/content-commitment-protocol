"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";

const InitWasm = ({ children }: { children: React.ReactNode }) => {
  const [init, setInit] = React.useState(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        initACVM(
          new URL(
            "@noir-lang/acvm_js/web/acvm_js_bg.wasm",
            import.meta.url
          ).toString()
        ),
        initNoirC(
          new URL(
            "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm",
            import.meta.url
          ).toString()
        ),
      ]);
      setInit(true);
    })();
  });

  return <div>{init && children}</div>;
};

export default function Home() {
  return (
    <InitWasm>
      {/* <main>
        <h1>Hello World!</h1>
        <Link href="/dashboard">Go to Dashboard</Link>
      </main> */}

      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            src="/assets/logo.jpg"
            alt="Zertify"
            style={{ width: 300, height: 300, margin: "0 auto" }}
          />
          <div style={{ fontSize: 200, fontFamily: "monospace" }}>ERTIFY</div>
        </div>

        <Link
          href="/dashboard"
          style={{
            marginTop: "20px",
            display: "inline-block",
            backgroundColor: "#0070f3",
            color: "white",
            padding: "10px 15px",
            borderRadius: "5px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Go to Editor
        </Link>
      </main>
    </InitWasm>
  );
}
