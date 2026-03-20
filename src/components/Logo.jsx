import { useApp } from "../context/AppContext";

export default function Logo({ height = 36, style = {} }) {
  const { dark } = useApp();
  return (
    <img
      src={dark ? "/logo-light.png" : "/logo-dark.png"}
      alt="EarBliss"
      style={{ height, objectFit: "contain", display: "block", ...style }}
    />
  );
}
