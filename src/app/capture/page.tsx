import type { Metadata } from "next";
import { CapturePage } from "@/components/capture/CapturePage";

export const metadata: Metadata = {
  title: "Capture - Brain Capture",
  description:
    "Quickly capture your ideas, thoughts, and insights with text or voice input",
};

export default function Capture() {
  return <CapturePage />;
}
