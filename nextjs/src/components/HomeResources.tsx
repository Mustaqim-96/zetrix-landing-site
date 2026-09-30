import { preload } from "react-dom";

export default function HomeResources() {
  preload("/vendor/three.min.js", { as: "script" });
  preload("/js/globe-data.js", { as: "script" });
  return null;
}
