interface Props {
  topology: string;
  numNodes: number;
  renderConnections: () => React.ReactNode;
  getX: (index: number) => number;
  getY: (index: number) => number;
  sender: number;
  receiver: number;
  packetPosition: { x: number; y: number };
  isTransferring: boolean;
  rejections: number[];
}

const TopologyVisualizer = ({
  numNodes,
  renderConnections,
  getX,
  getY,
  sender,
  receiver,
  packetPosition,
  isTransferring,
  rejections,
}: Props) => (
  <div className="relative mt-8 w-[428px] h-[400px] max-md:w-[600px] max-sm:w-[428px]">
    <svg className="absolute w-[501px] h-[400px]">{renderConnections()}</svg>
    {Array.from({ length: numNodes }, (_, index) => (
      <div
        key={index}
        className={`absolute h-12 w-12 flex items-center justify-center border border-black rounded-full
          ${sender === index + 1 ? "bg-green-600" : ""} 
          ${receiver === index + 1 ? "bg-cyan-500" : ""} 
          ${
            sender !== index + 1 && receiver !== index + 1
              ? "bg-indigo-300 text-black"
              : "text-white"
          }`}
        style={{
          left: `${getX(index)}px`,
          top: `${getY(index)}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {index + 1}
        {rejections.includes(index + 1) && (
          <div className="absolute text-red-600 text-xl">❌</div>
        )}
        {!isTransferring && receiver === index + 1 && (
          <div className="absolute text-green-600 text-xl">✅</div>
        )}
      </div>
    ))}
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

export default TopologyVisualizer;
