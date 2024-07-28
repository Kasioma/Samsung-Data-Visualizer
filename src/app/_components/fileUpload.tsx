"use client";

import Upload from "./Upload";

export default function FileUpload() {
  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    if (!file) throw new Error("Network response was not ok");
    const response = await fetch("api", {
      method: "POST",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) throw new Error("Network response was not ok");

    type DataType = Record<string, number | null>;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: DataType[] = await response.json();
    const db = await openDatabase("File", 1);
    await clearDatabase(db);
    await storeData(db, data);

    function openDatabase(name: string, version: number): Promise<IDBDatabase> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains("data"))
            db.createObjectStore("data", { autoIncrement: true });
        };

        request.onsuccess = (event) => {
          resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
          reject((event.target as IDBOpenDBRequest).error);
        };
      });
    }

    function clearDatabase(db: IDBDatabase): Promise<void> {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("data", "readwrite");
        const objectStore = transaction.objectStore("data");

        const request = objectStore.clear();

        request.onsuccess = () => {
          transaction.oncomplete = () => {
            resolve();
          };
        };

        request.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      });
    }

    // function initializeObjectStore(db: IDBDatabase, storeName: string, keys: string[]){

    // }

    function storeData(
      db: IDBDatabase,
      data: Record<string, number | null>[],
    ): Promise<void> {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction("data", "readwrite");
        const objectStore = transaction.objectStore("data");

        data.forEach((item) => {
          objectStore.add(item);
        });

        transaction.oncomplete = () => {
          resolve();
        };

        transaction.onerror = (event) => {
          reject((event.target as IDBTransaction).error);
        };
      });
    }
  }
  return (
    <>
      <div className="text-text-100">
        <label>
          <input type="file" hidden onChange={handleFileUpload} />
          <div className="border-primary-500 text-primary-500 mx-auto flex h-1/5 w-3/4 flex-col items-center justify-center gap-3 rounded border-4 border-dashed p-4 text-2xl">
            <div className="flex flex-col items-center justify-center">
              <h2>Click to select file</h2>
              <Upload />
            </div>
          </div>
        </label>
      </div>
    </>
  );
}
