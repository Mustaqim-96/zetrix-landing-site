"use client";

import { useEffect, useRef } from "react";
import DownloadAppCard from "./DownloadAppCard";

// Hero "Get Started" button that opens the download card in a modal. The
// button stays a link to #download, so it still scrolls there before
// hydration. The native <dialog> traps focus, closes on Esc and returns focus
// to the button on close.
export default function GetStartedModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Leaving the page with the modal open must not leave the scroll lock behind.
  useEffect(() => () => document.documentElement.classList.remove("has-modal"), []);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <a
        className="button"
        href="#download"
        aria-haspopup="dialog"
        onClick={(event) => {
          const dialog = dialogRef.current;
          if (!dialog || typeof dialog.showModal !== "function") return;
          event.preventDefault();
          dialog.showModal();
          document.documentElement.classList.add("has-modal"); // locks page scroll
        }}
      >
        Get Started
      </a>
      <dialog
        ref={dialogRef}
        className="download-modal"
        aria-labelledby="download-modal-title"
        onClick={(event) => {
          // Clicks on the backdrop land on the <dialog> itself.
          if (event.target === event.currentTarget) close();
        }}
        onClose={() => document.documentElement.classList.remove("has-modal")}
      >
        <div className="download-modal__panel">
          <button className="download-modal__close" type="button" aria-label="Close" onClick={close}>
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <DownloadAppCard titleId="download-modal-title" />
        </div>
      </dialog>
    </>
  );
}
