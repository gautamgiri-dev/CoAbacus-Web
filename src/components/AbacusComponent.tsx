import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

const BeadColors = ["blue", "green", "red", "yellow", "alice_blue"];

function GetBeadImageSrc(color: string) {
  return `/ic_bead_${color}.png`;
}

interface AbacusRodProps {
  multiplier: number;
  color?: string;
  onValueUpdate?: (value: number, multiplier: number) => void;
}

// Separate Component for each rod
function AbacusRod(props: AbacusRodProps) {
  const [value, setValue] = useState(0);

  const color = useMemo(
    () =>
      props.color ?? BeadColors[Math.floor(Math.random() * BeadColors.length)],
    []
  );

  const heavenRef = useRef<HTMLImageElement>(null);
  const oneRef = useRef<HTMLImageElement>(null);
  const twoRef = useRef<HTMLImageElement>(null);
  const threeRef = useRef<HTMLImageElement>(null);
  const fourRef = useRef<HTMLImageElement>(null);

  const earthRefs = useMemo(
    () => [oneRef, twoRef, threeRef, fourRef],
    [oneRef, twoRef, threeRef, fourRef]
  );

  // Function to handle clicking on a bead
  const handleBeadClick = (index: number) => {
    if (index == 4 && heavenRef.current) {
      const isTouching = heavenRef.current.classList.contains("touching");
      if (isTouching) {
        heavenRef.current.style.top = "10%";
        heavenRef.current.classList.remove("touching");
        setValue((v) => v - 5);
      } else {
        heavenRef.current.style.top = "22%";
        heavenRef.current.classList.add("touching");
        setValue((v) => v + 5);
      }
    } else {
      const senderRef = earthRefs[index].current!;
      const isSenderTouching = senderRef.classList.contains("touching");

      if (!isSenderTouching) {
        // Sender Bead is not touching the beam
        // Send All upper beads which are not touching the beam to top
        earthRefs.slice(0, index + 1).forEach((earthRef) => {
          const currentRef = earthRef.current!;
          const isTouching = currentRef.classList.contains("touching");
          if (!isTouching) {
            const currentPosition = parseInt(
              currentRef.style.bottom.split("%")[0]
            );
            currentRef.style.bottom = `${currentPosition + 26}%`;
            currentRef.classList.add("touching");
            setValue((v) => v + 1);
          }
        });
      } else {
        earthRefs.slice(index).forEach((earthRef) => {
          const currentRef = earthRef.current!;
          const isTouching = currentRef.classList.contains("touching");
          if (isTouching) {
            const currentPosition = parseInt(
              currentRef.style.bottom.split("%")[0]
            );
            currentRef.style.bottom = `${currentPosition - 26}%`;
            currentRef.classList.remove("touching");
            setValue((v) => v - 1);
          }
        });
      }
    }
  };

  useEffect(() => {
    props.onValueUpdate?.(value, props.multiplier);
  }, [value]);

  return (
    <div className="relative flex items-center justify-center h-full w-[5%]">
      <img className="h-full w-[20%] -z-20" src="/ic_rod.png" />
      {/* 5 bead 4 earth beads and 1 heaven bead */}
      {/* Heaven Bead */}
      {/* <div className="absolute flex flex-col justify-between py-5 h-full w-full"> */}
      <img
        ref={heavenRef}
        onClick={() => handleBeadClick(4)}
        style={{
          top: "10%",
          zIndex: 10000,
        }}
        className="absolute duration-100 ease-in"
        src={GetBeadImageSrc(color)}
      />

      {/* <div className="flex flex-col items-center"> */}
      <img
        ref={oneRef}
        style={{
          bottom: "34%",
          zIndex: 10000,
        }}
        onClick={() => handleBeadClick(0)}
        className="absolute duration-100 ease-in"
        src={GetBeadImageSrc(color)}
      />
      <img
        ref={twoRef}
        style={{
          bottom: "26%",
          zIndex: 10000,
        }}
        onClick={() => handleBeadClick(1)}
        className="absolute duration-100 ease-in"
        src={GetBeadImageSrc(color)}
      />
      <img
        ref={threeRef}
        style={{
          bottom: "18%",
          zIndex: 10000,
        }}
        onClick={() => handleBeadClick(2)}
        className="absolute duration-100 ease-in"
        src={GetBeadImageSrc(color)}
      />
      <img
        ref={fourRef}
        style={{
          bottom: "10%",
          zIndex: 10000,
        }}
        onClick={() => handleBeadClick(3)}
        className="absolute duration-100 ease-in"
        src={GetBeadImageSrc(color)}
      />
      {/* </div> */}
      {/* </div> */}
    </div>
  );
}

interface AbacusComponentProps {
  style?: React.CSSProperties;
  onValueChange: (value: number) => void;
}

const DefaultStyles: CSSProperties = {
  position: "relative",
  height: "300px",
  width: "675px",
  maxWidth: "calc(100svw - 80px)",
  maxHeight: "calc(100svh - 80px)",
};

type AbacusValue = Record<number, number>;

export default function AbacusComponent(props: AbacusComponentProps) {
  const [values, setValues] = useState<AbacusValue>({});

  function handleValueUpdate(rodValue: number, multiplier: number) {
    const updatePayload = {
      ...values,
      [multiplier]: rodValue,
    };
    setValues(updatePayload);
  }

  useEffect(() => {
    props.onValueChange(
      Object.entries(values)
        .map((val) => parseFloat(val[0]) * val[1])
        .reduce((a, b) => a + b, 0)
    );
  }, [JSON.stringify(values)]);

  return (
    <div style={{ ...DefaultStyles, ...props.style }} className="">
      {/* Background Image should be the border (frame) */}
      <img className="absolute w-full h-full" src="/ic_frame.png" />
      {/* Heaven Bar */}
      <img className="absolute w-full top-[30%] -z-10" src="/ic_beam.png" />

      {/* Maybe calculate how many rods we need. By default we draw 8 rods */}
      <div className="h-full px-14 flex justify-between items-center">
        <AbacusRod multiplier={1000000} onValueUpdate={handleValueUpdate} />
        <AbacusRod multiplier={100000} onValueUpdate={handleValueUpdate} />
        <AbacusRod multiplier={10000} onValueUpdate={handleValueUpdate} />
        <AbacusRod multiplier={1000} onValueUpdate={handleValueUpdate} />
        <AbacusRod multiplier={100} onValueUpdate={handleValueUpdate} />
        <AbacusRod multiplier={10} onValueUpdate={handleValueUpdate} />
        <AbacusRod
          color="white"
          multiplier={1}
          onValueUpdate={handleValueUpdate}
        />
        <AbacusRod multiplier={0.1} onValueUpdate={handleValueUpdate} />
        <AbacusRod multiplier={0.01} onValueUpdate={handleValueUpdate} />
      </div>
    </div>
  );
}
