import React, {createRef, CSSProperties, useImperativeHandle, useMemo, useRef, useState} from "react";

const BeadColors = ["blue", "green", "red", "yellow", "alice_blue"];

function GetBeadImageSrc(color: string) {
  return `/ic_bead_${color}.png`;
}

interface AbacusRodProps {
  multiplier: number;
  color?: string;
  onValueUpdate?: (value: number, multiplier: number) => void;
}

export interface AbacusRodRef {
    getRodValue: () => number;
    reset: () => void;
}

const AbacusRod = React.forwardRef<AbacusRodRef, AbacusRodProps>(
    (props, ref) => {
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

        function getRodValue() {
            return value * (Math.pow(10, props.multiplier));
        }

        function reset() {
            setValue(0);
            const isTouching = heavenRef.current?.classList.contains("touching");
            if (isTouching && heavenRef.current) {
                heavenRef.current.style.top = "10%";
                heavenRef.current.classList.remove("touching");
            }

            // Reset other beads
            earthRefs.forEach((earthRef) => {
                const currentRef = earthRef.current;
                if(currentRef) {
                    const isTouching = currentRef.classList.contains("touching");
                    if (isTouching) {
                        const currentPosition = parseInt(
                            currentRef.style.bottom.split("%")[0]
                        );
                        currentRef.style.bottom = `${currentPosition - 26}%`;
                        currentRef.classList.remove("touching");
                    }
                }
            })
        }

        useImperativeHandle(ref, () => ({
           getRodValue,
           reset
        }));

        return (
            <div className="relative flex items-center justify-center h-full w-[5%]">
                <img className="h-full w-[20%] -z-20" src="/ic_rod.png"  alt={"rod"}/>
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
                    alt={"heaven-bead"}
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
                    alt={"earth-bead"}
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
                    alt={"earth-bead"}
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
                    alt={"earth-bead"}
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
                    alt={"earth-bead"}
                />
            </div>
        );
    }
)

interface RodConfig{
    integralPlaces: number;
    decimalPlaces: number;
}

interface AbacusComponentProps {
    rodsConfig?: RodConfig;
    style?: React.CSSProperties;
    onValueChange?: (value: number) => void;
}

const DefaultStyles: CSSProperties = {
  position: "relative",
  height: "300px",
  width: "675px",
  maxWidth: "calc(100svw - 80px)",
  maxHeight: "calc(100svh - 80px)",
};

export interface AbacusComponentRef {
    getAbacusValue: () => number;
    reset: () => void;
}

const AbacusComponent = React.forwardRef<AbacusComponentRef, AbacusComponentProps>(
    (props: AbacusComponentProps, ref) => {
        const {
            integralPlaces,
            decimalPlaces,
        } = props.rodsConfig || {decimalPlaces: 2, integralPlaces: 6};
        const numRods = useMemo(() => integralPlaces + decimalPlaces, [props.rodsConfig]);
        const rodsRef = useRef(Array(numRods).fill(0).map(() => createRef<AbacusRodRef>()));

        function getAbacusValue() {
            return rodsRef.current?.reduce((a, b) => a + (b.current?.getRodValue() || 0), 0)
        }

        function reset() {
            console.log("Resetting abacus");
            rodsRef.current?.forEach(rod => rod.current?.reset())
        }

        useImperativeHandle((ref), () => ({
            getAbacusValue,
            reset
        }));

        return (
            <div style={{ ...DefaultStyles, ...props.style }} className="">
                {/* Background Image should be the border (frame) */}
                <img className="absolute w-full h-full" src="/ic_frame.png" alt={"frame"} />
                {/* Heaven Bar */}
                <img className="absolute w-full top-[30%] -z-10" src="/ic_beam.png" alt={"heaven-bar"} />

                {/* Maybe calculate how many rods we need. By default, we draw 8 rods */}
                <div className="h-full px-14 flex justify-between items-center">
                    {
                        Array(integralPlaces).fill(0).map(
                            (_, i) =>
                                <AbacusRod
                                    multiplier={integralPlaces - i - 1}
                                    ref={rodsRef.current[i]}
                                    key={integralPlaces - i - 1}
                                    color={(i == integralPlaces - 1) ? "white" : undefined} />
                        )
                    }

                    {
                        Array(decimalPlaces).fill(0)
                            .map((_, i) =>
                                <AbacusRod
                                    multiplier={-(decimalPlaces - i)}
                                    ref={rodsRef.current[i+integralPlaces]}
                                    key={decimalPlaces - i - 1}
                                    />
                            ).reverse()
                    }
                </div>
            </div>)
    }
);
export default AbacusComponent;