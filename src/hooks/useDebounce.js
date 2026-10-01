import { useEffect, useState } from "react";

// value বদলানোর পর delay ms থামলে তবেই নতুন value দেয়।
// টাইপ করার প্রতিটা অক্ষরে API call না করে, থেমে গেলে একবার করার জন্য।
export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t); // নতুন value এলে আগের টাইমার বাতিল
  }, [value, delay]);
  return debounced;
}