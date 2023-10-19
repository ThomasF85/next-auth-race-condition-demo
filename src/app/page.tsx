"use client";

import styles from "./page.module.css";
import { getSession, signIn, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, update } = useSession() as { data: any; update: any };
  return (
    <main className={styles.main}>
      {!session && (
        <>
          <p>Login with Username: Karl, Password: password</p>
          <button onClick={() => signIn()}>sign in</button>
        </>
      )}
      {session && (
        <>
          <div>You are logged in as {session.user?.name}</div>
          <div>
            Your access and refresh tokens have version {session.tokenVersion}
          </div>
          <button
            onClick={() => {
              getSession();
              update();
            }}
          >
            Manually trigger token update with slow getSession call shortly
            before
          </button>
          <button
            onClick={() => {
              update();
            }}
          >
            Manually trigger just an update with no concurrent getSession call
          </button>
        </>
      )}
    </main>
  );
}
