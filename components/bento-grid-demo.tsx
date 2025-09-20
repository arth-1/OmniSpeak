import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconArrowWaveRightUp,
  IconBoxAlignRightFilled,
  IconBoxAlignTopLeft,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";

export default function BentoGridDemo() {
  return (
    <BentoGrid className="max-w-5xl mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20"></div>
);
const items = [
  {
    title: "Instant Property Summaries",
    description: "Auto-generated property summaries for listings and client briefs.",
    header: <Skeleton />,
    icon: <IconClipboardCopy className="h-4 w-4 text-blue-300" />,
  },
  {
    title: "Accurate Transcription",
    description: "High-quality speech-to-text for recorded calls and meetings.",
    header: <Skeleton />,
    icon: <IconFileBroken className="h-4 w-4 text-blue-300" />,
  },
  {
    title: "Multi-lingual Translation",
    description: "Seamless translations to communicate with global clients.",
    header: <Skeleton />,
    icon: <IconArrowWaveRightUp className="h-4 w-4 text-blue-300" />,
  },
  {
    title: "Market Analytics",
    description: "Connect data and market trends into bite-sized insights for agents.",
    header: <Skeleton />,
    icon: <IconTableColumn className="h-4 w-4 text-blue-300" />,
  },
  {
    title: "AI-Powered Workflows",
    description: "Streamline repetitive tasks like follow-ups, scheduling, and lead management.",
    header: <Skeleton />,
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-blue-300" />,
  },
];
