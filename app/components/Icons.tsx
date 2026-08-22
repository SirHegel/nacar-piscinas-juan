import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const defaults = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

export function DropletIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 3.2S5.8 9.7 5.8 14.4a6.2 6.2 0 0 0 12.4 0C18.2 9.7 12 3.2 12 3.2Z" />
      <path d="M9.1 15.2c.4 1.3 1.4 2 2.9 2.2" />
    </svg>
  );
}

export function WavesIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M3 7.5c2 0 2 1.5 4 1.5s2-1.5 4-1.5S13 9 15 9s2-1.5 4-1.5S21 9 23 9" />
      <path d="M1 13c2 0 2 1.5 4 1.5S7 13 9 13s2 1.5 4 1.5 2-1.5 4-1.5 2 1.5 4 1.5" />
      <path d="M3 18.5c2 0 2 1.5 4 1.5s2-1.5 4-1.5S13 20 15 20s2-1.5 4-1.5" />
    </svg>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="m12 2 1.3 4.7L18 8l-4.7 1.3L12 14l-1.3-4.7L6 8l4.7-1.3L12 2Z" />
      <path d="m19 14 .8 2.7 2.7.8-2.7.8L19 21l-.8-2.7-2.7-.8 2.7-.8L19 14Z" />
      <path d="m5 13 .7 2.3L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.7L5 13Z" />
    </svg>
  );
}

export function CompassIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z" />
    </svg>
  );
}

export function SlidersIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M4 7h5M15 7h5M4 17h9M18 17h2" />
      <circle cx="12" cy="7" r="3" />
      <circle cx="16" cy="17" r="2" />
    </svg>
  );
}

export function ToolIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M14.5 6.5a4 4 0 0 0-5-5l2.2 2.2-2.8 2.8-2.2-2.2a4 4 0 0 0 5 5l7.2 7.2a1.7 1.7 0 0 1-2.4 2.4l-7.2-7.2" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 3 5 6v5c0 4.7 2.9 8 7 10 4.1-2 7-5.3 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-5" />
    </svg>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M21 11.5a8.3 8.3 0 0 1-9 8.2 9.2 9.2 0 0 1-3.6-.9L3 20.5l1.7-5A8.2 8.2 0 1 1 21 11.5Z" />
      <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function VolumeIcon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M7 20h10M9 20v-4h6v4M7 4h10l-1 12H8L7 4Z" />
      <path d="M8 9c2-1 6 1 8 0" />
    </svg>
  );
}
