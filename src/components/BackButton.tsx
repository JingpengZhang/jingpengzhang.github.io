export default function BackButton({
  fallback = "/",
  children,
}: {
  fallback?: string;
  children?: React.ReactNode;
}) {
  const handleClick = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = fallback;
      }
    }
  };

  return <div onClick={handleClick}>{children}</div>;
}
