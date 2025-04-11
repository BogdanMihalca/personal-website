import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export const useHash = () => {
  const [hash, setHash] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash;
    }
    return "";
  });


  const pathname = usePathname();

  useEffect(() => {

    setHash(window.location.hash);

    const onHashChange = () => {
      setHash(window.location.hash);
    };

    window.addEventListener("hashchange", onHashChange);

    const checkHashOnInterval = setInterval(() => {
      if (window.location.hash !== hash) {
        setHash(window.location.hash);
      }
    }, 200);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      clearInterval(checkHashOnInterval);
    };
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return hash;
};
