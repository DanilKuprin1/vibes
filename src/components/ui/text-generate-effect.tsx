"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(/(\s+|\n)/);
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.2),
      }
    );
  }, [scope.current]);

  const renderWords = () => (
    <motion.div ref={scope}>
      {words.split("\n").map((line, lineIdx) => (
        <div key={lineIdx}>
          {line.split(" ").map((word, idx) => (
            <motion.span
              key={word + idx}
              // className="dark:text-white text-black opacity-0"
              style={{ filter: filter ? "blur(10px)" : "none" }}
            >
              {word}{" "}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.div>
  );

  return (
    <div className={cn(className)}>
      <div className="mt-4">
        <div className=" leading-snug tracking-wide whitespace-pre-line">
          {" "}
          {/* dark:text-white text-black text-2xl*/}
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
