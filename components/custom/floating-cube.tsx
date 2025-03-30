import { motion } from "framer-motion";

const FloatingCube = () => {
  return (
    <div className="hidden lg:block absolute bottom-[40%] right-[25%] z-0 opacity-90">
      <motion.div
        animate={{
          rotateY: [0, 180, 360],
          rotateX: [0, 180, 360],
          rotateZ: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          transformStyle: "preserve-3d",
          width: "180px",
          height: "180px",
        }}
      >
        {[
          {
            transform: "translateZ(90px)",
            bg: "from-neon-pink to-neon-blue",
          },

          {
            transform: "rotateY(180deg) translateZ(90px)",
            bg: "from-neon-green to-neon-yellow",
          },

          {
            transform: "rotateX(90deg) translateZ(90px)",
            bg: "from-neon-purple to-neon-orange",
          },

          {
            transform: "rotateX(-90deg) translateZ(90px)",
            bg: "from-neon-red to-neon-cyan",
          },

          {
            transform: "rotateY(-90deg) translateZ(90px)",
            bg: "from-neon-blue to-neon-pink",
          },

          {
            transform: "rotateY(90deg) translateZ(90px)",
            bg: "from-neon-yellow to-neon-green",
          },
        ].map((face, index) => (
          <div
            key={index}
            className={`absolute w-full h-full bg-linear-to-br ${face.bg} border border-neon-cyan`}
            style={{
              transform: face.transform,
              backfaceVisibility: "hidden",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-lg font-bold text-white opacity-80">
                {index % 2 === 0 ? (
                  <div className="p-4 text-xs   text-neon-green">
                    <pre className="bg-black text-green-500 p-2 rounded-md shadow-lg">
                      {`const hello = "world";\nconsole.log(hello);`}
                    </pre>
                  </div>
                ) : (
                  <div className="h-full w-full p-2">
                    <div className="h-full w-full border border-dashed border-neon-pink rounded-sm"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export { FloatingCube };
