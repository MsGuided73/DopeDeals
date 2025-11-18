import { ShaderAnimation } from "./shader-animation";

export default function ShroomsDemo() {
  return (
    <div className="relative flex h-[650px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border bg-purple-900">
      <ShaderAnimation />
      <span className="absolute pointer-events-none z-10 text-center text-7xl leading-none font-semibold tracking-tighter whitespace-pre-wrap text-white drop-shadow-[0_0_25px_rgba(147,51,234,0.9)]">
        Shrooms
      </span>
    </div>
  );
}
