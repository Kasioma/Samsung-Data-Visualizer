"use client";

import Upload from "./upload";

type ResponseType = {
  data: Record<string, number | null>[];
  invalidData: number;
  id_student: string[];
  id_activity: string[];
  id_session: string[];
  timestamp: Record<number, string>[];
};

type OnFileUploadComplete = (
  fileName: string,
  invalidData: number,
  id_student: string[],
  id_activity: string[],
  id_session: string[],
  timestamp: Record<number, string>[],
) => void;

interface FileUploadProps {
  onFileUploadComplete: OnFileUploadComplete;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploadComplete }) => {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const apiResponse: ResponseType = await response.json();
    const db = await openDatabase("File", 1);
    await clearDatabase(db);
    await storeData(db, apiResponse.data);

    onFileUploadComplete(
      file.name,
      apiResponse.invalidData,
      apiResponse.id_student,
      apiResponse.id_activity,
      apiResponse.id_session,
      apiResponse.timestamp,
    );

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
          <div className="mx-auto flex w-3/4 cursor-pointer flex-col items-center justify-center gap-3 rounded border border-dashed p-4 text-3xl text-primary-50">
            <Upload />
            <p className="text-sm">Click to Upload</p>
          </div>
        </label>
      </div>
    </>
  );
};

export default FileUpload;
