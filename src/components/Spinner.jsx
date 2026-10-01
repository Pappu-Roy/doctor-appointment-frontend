export default function Spinner({ className = "" }) {
  return (
    <span
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-line border-t-brand ${className}`}
      aria-label="লোড হচ্ছে"
    />
  );
}