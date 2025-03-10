import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <h2>Home page</h2>
         Length of  API_KEY_1 : {process.env.API_KEY_1?.length}
      </main>
    </div>
  );
}
