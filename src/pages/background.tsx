import { ReactNode } from "react";
import "./Background.css";

interface BackgroundProps {
  children?: ReactNode;
}

export default function Background({ children }: BackgroundProps) {
  return (
    <div className="background-geral">
      <div className="bg-layer layer1"></div>
      <div className="bg-layer layer2"></div>
      <div className="bg-layer layer3"></div>
      <div className="bg-layer layer4"></div>
      <div className="bg-layer layer5"></div>
      <div className="bg-layer layer6"></div>
      <div className="bg-layer layer7"></div>
      <div className="bg-layer layer8"></div>
      <div className="bg-layer layer9"></div>

      <div className="conteudo">{children}</div>
    </div>
  );
}
