import * as React from "react";

export const RotateToHorizontalIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      d="M12 5v14h7V5h-7zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
      fill="currentColor"
    ></path>
  </svg>
);

export const RotateToVerticalIcon = (props) => (
  <RotateToHorizontalIcon {...props} style={{ transform: "rotate(-90deg)" }} />
);

export const ErrorIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
      fill="currentColor"
    ></path>
  </svg>
);

export const FullscreenIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      d="M5 5h5v2H7v3H5V5m9 0h5v5h-2V7h-3V5m3 9h2v5h-5v-2h3v-3m-7 3v2H5v-5h2v3h3z"
      fill="currentColor"
    ></path>
  </svg>
);

export const ExitFullscreenIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      d="M14 14h5v2h-3v3h-2v-5m-9 0h5v5H8v-3H5v-2m3-9h2v5H5V8h3V5m11 3v2h-5V5h2v3h3z"
      fill="currentColor"
    ></path>
  </svg>
);

export const ShowCodeIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      d="M8.7 15.9L4.8 12l3.9-3.9a.984.984 0 0 0 0-1.4a.984.984 0 0 0-1.4 0l-4.59 4.59a.996.996 0 0 0 0 1.41l4.59 4.6c.39.39 1.01.39 1.4 0a.984.984 0 0 0 0-1.4zm6.6 0l3.9-3.9l-3.9-3.9a.984.984 0 0 1 0-1.4a.984.984 0 0 1 1.4 0l4.59 4.59c.39.39.39 1.02 0 1.41l-4.59 4.6a.984.984 0 0 1-1.4 0a.984.984 0 0 1 0-1.4z"
      fill="currentColor"
    ></path>
  </svg>
);

export const HideCodeIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      d="M19.17 12l-3.88-3.88a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41l-2.88 2.88L17 14.17L19.17 12zM2.1 4.93l3.49 3.49l-2.88 2.88a.996.996 0 0 0 0 1.41L7.3 17.3a.996.996 0 1 0 1.41-1.41L4.83 12L7 9.83L19.07 21.9a.996.996 0 1 0 1.41-1.41L3.51 3.51a.996.996 0 0 0-1.41 0c-.39.4-.39 1.03 0 1.42z"
      fill="currentColor"
    ></path>
  </svg>
);

export const DisconnectedIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M21.707 3.707a1 1 0 0 0-1.414-1.414L18.496 4.09a4.252 4.252 0 0 0-5.251.604l-1.068 1.069a1.75 1.75 0 0 0 0 2.474l3.585 3.586a1.75 1.75 0 0 0 2.475 0l1.068-1.068a4.252 4.252 0 0 0 .605-5.25l1.797-1.798Zm-11 8a1 1 0 0 0-1.414-1.414l-1.47 1.47l-.293-.293a.75.75 0 0 0-1.06 0l-1.775 1.775a4.252 4.252 0 0 0-.605 5.25l-1.797 1.798a1 1 0 1 0 1.414 1.414l1.798-1.797a4.252 4.252 0 0 0 5.25-.605l1.775-1.775a.75.75 0 0 0 0-1.06l-.293-.293l1.47-1.47a1 1 0 0 0-1.414-1.414l-1.47 1.47l-1.586-1.586l1.47-1.47Z"
    />
  </svg>
);

export const ConnectedIcon = (props) => (
  <svg width="1em" height="1em" viewBox="0 0 20 20" {...props}>
    <path
      fill="currentColor"
      d="M17.78 3.28a.75.75 0 0 0-1.06-1.06l-2.446 2.445a4.037 4.037 0 0 0-5.128.481l-.3.3a1.49 1.49 0 0 0 0 2.108l3.6 3.6a1.49 1.49 0 0 0 2.107 0l.3-.3a4.037 4.037 0 0 0 .482-5.128L17.78 3.28ZM7.554 8.846a1.49 1.49 0 0 0-2.107 0l-.3.3a4.037 4.037 0 0 0-.481 5.128L2.22 16.72a.75.75 0 1 0 1.06 1.06l2.446-2.446a4.037 4.037 0 0 0 5.128-.48l.3-.3a1.49 1.49 0 0 0 0-2.108l-3.6-3.6Z"
    />
  </svg>
);
