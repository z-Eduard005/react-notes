import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ScrollMemory: React.FC = () => {
  const { pathname } = useLocation();
  const [scrollPositions, setScrollPositions] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const handleScroll = () => {
      setScrollPositions((prev) => ({
        ...prev,
        [pathname]:
          document.body.scrollTop || document.documentElement.scrollTop,
      }));
    };

    document.body.addEventListener("scroll", handleScroll);

    return () => {
      document.body.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (scrollPositions[pathname]) {
      setTimeout(() => {
        document.body.scrollTop = scrollPositions[pathname];
        // for cross-browser compatibility
        document.documentElement.scrollTop = scrollPositions[pathname];
      }, 0);
    } else {
      setTimeout(() => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }, 0);
    }
  }, [pathname, scrollPositions]);

  return null;
};

export default ScrollMemory;
