import { Laptop } from "lucide-react";

interface Props {
  topology: string;
  numNodes: number;
  renderConnections: () => React.ReactNode;
  getX: (index: number) => number;
  getY: (index: number) => number;
  receiver: number;
  packetPosition: { x: number; y: number };
  isTransferring: boolean;
  isReached: boolean;
  rejections: number[];
}

const TopologyVisualizer = ({
  topology,
  numNodes,
  renderConnections,
  getX,
  getY,
  receiver,
  packetPosition,
  isTransferring,
  isReached,
  rejections,
}: Props) => {
  const currentBusWidth = numNodes * 100 + 1 + "px";
  return (
    <div
      className={`relative mt-8 w-[428px] h-[400px] max-md:w-[600px] max-sm:w-[428px] ${
        topology === "Bus" && numNodes > 6
          ? "right-[20%]"
          : topology === "Bus" && numNodes <= 5
          ? "right-[10%]"
          : ""
      }
      `}
    >
      <svg
        className={`absolute h-[400px]`}
        style={{
          width: `${topology === "Bus" ? currentBusWidth : "501px"}`,
        }}
      >
        {renderConnections()}
      </svg>
      {Array.from({ length: numNodes }, (_, index) => {
        return (
          <div
            key={`node-${index}`}
            className={`absolute h-12 w-12 flex items-center justify-center`}
            style={{
              left: `${getX(index)}px`,
              top: `${getY(index)}px`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {rejections.includes(index + 1) && (
              <div className="absolute text-red-600 text-xl">❌</div>
            )}
            {isReached && receiver === index + 1 && (
              <div className="absolute text-green-600 text-4xl z-10 rounded-md">
                ✅
              </div>
            )}
            <Laptop size={37} className="bg-white" />
            <span className="absolute text-xs text-center text-gray-500 font-bold">
              {index + 1}
            </span>
          </div>
        );
      })}
      {isTransferring && (
        <div
          className="absolute h-8 w-8 bg-red-500 rounded"
          style={{
            left: `${packetPosition.x}px`,
            top: `${packetPosition.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}
    </div>
  );
};

export default TopologyVisualizer;
