import React, { useEffect } from "react";
import Link from "next/link";
import initNoirC from '@noir-lang/noirc_abi';
import initACVM from '@noir-lang/acvm_js';

const InitWasm = ({ children }: { children: React.ReactNode }) => {
  const [init, setInit] = React.useState(false);
  useEffect(() => {
    (async () => {
      await Promise.all([
        initACVM(new URL('@noir-lang/acvm_js/web/acvm_js_bg.wasm', import.meta.url).toString()),
        initNoirC(
          new URL('@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm', import.meta.url).toString(),
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
      <main>
        <h1>Hello World!</h1>
        <Link href="/dashboard">Go to Dashboard</Link>
      </main>
    </InitWasm>
  );
}
