import { useCallback, useEffect, useMemo, useState } from "react";
import { DoneContractClient } from "@donezone/client";
import "./App.css";

type GreetingResponse = {
  greeting: string;
};

const baseUrl =
  import.meta.env.VITE_DONE_HTTP_URL ??
  import.meta.env.VITE_DONE_HTTP ??
  "http://127.0.0.1:8787";

const contractAddress =
  import.meta.env.VITE_DONE_CONTRACT_HELLO_WORLD ??
  import.meta.env.DONE_CONTRACT_HELLO_WORLD ??
  "";

function useHelloContract() {
  return useMemo(() => {
    if (!contractAddress) {
      return null;
    }

    return new DoneContractClient({
      baseUrl,
      address: contractAddress,
    });
  }, [baseUrl, contractAddress]);
}

function useGreeting(client: DoneContractClient | null) {
  const [greeting, setGreeting] = useState<string>("...");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!client) {
      setError("Contract address missing. Deploy via `bunx done dev` and reload.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await client.query<GreetingResponse>("/greeting");
      setGreeting(response.greeting);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { greeting, reload, isLoading, error } as const;
}

function App() {
  const client = useHelloContract();
  const { greeting, reload, isLoading, error } = useGreeting(client);

  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">Done Template</p>
        <h1>React starter talking to your Done contract</h1>
        <p>
          Run <code>bunx done dev</code> to deploy <code>helloWorld</code> locally. The CLI will
          write the contract address to <code>.done/dev.env</code>, which Vite reads via
          <code>DONE_CONTRACT_HELLO_WORLD</code>.
        </p>
      </header>

      <section className="card">
        <p className="label">Current greeting</p>
        <p className="greeting">{greeting}</p>
        <div className="actions">
          <button onClick={() => reload()} disabled={isLoading}>
            {isLoading ? "Refreshing…" : "Refresh greeting"}
          </button>
          <span className="status">
            {contractAddress ? `Contract: ${contractAddress}` : "Missing contract address"}
          </span>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>
    </main>
  );
}

export default App;
