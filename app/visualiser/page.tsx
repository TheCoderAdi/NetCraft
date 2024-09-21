"use client";
import React, { useEffect, useState } from "react";
import TopologySelector from "@/components/shared/TopologySelector";
import NodeInput from "@/components/shared/NodeInput";
import TopologyVisualizer from "@/components/shared/TopologyVisualizer";
import toast from "react-hot-toast";
import { topologies } from "@/lib/constants/data";

const VisualizerPage = () => {
  const [topology, setTopology] = useState("Mesh");
  const [sender, setSender] = useState(1);
  const [receiver, setReceiver] = useState(2);
  const [isTransferring, setIsTransferring] = useState(false);
  const [packetPosition, setPacketPosition] = useState({ x: 0, y: 0 });
  const [rejections, setRejections] = useState<number[]>([]);

  const numNodes = 5;

  useEffect(() => {
    if (isTransferring) {
      if (topology === "Ring") {
        const ringPath: number[] = [];

        if (sender < receiver) {
          for (let i = sender - 1; i < receiver; i++) {
            ringPath.push(i);
          }
        } else {
          for (let i = sender - 1; i < numNodes; i++) {
            ringPath.push(i);
          }
          for (let i = 0; i < receiver; i++) {
            ringPath.push(i);
          }
        }

        let currentNodeIndex = 0;

        const senderX = getX(ringPath[0]);
        const senderY = getY(ringPath[0]);

        const movePacket = () => {
          const nextNode = ringPath[currentNodeIndex + 1];

          if (nextNode !== undefined) {
            const nextNodeX = getX(nextNode);
            const nextNodeY = getY(nextNode);

            const duration = 1000;
            const startTime = Date.now();

            const animatePacket = () => {
              const currentTime = Date.now();
              const progress = Math.min(
                (currentTime - startTime) / duration,
                1
              );

              const currentX = senderX + progress * (nextNodeX - senderX);
              const currentY = senderY + progress * (nextNodeY - senderY);

              setPacketPosition({ x: currentX, y: currentY });

              if (progress < 1) {
                requestAnimationFrame(animatePacket);
              } else {
                setTimeout(() => {
                  currentNodeIndex++;
                  if (nextNode + 1 !== receiver) {
                    setRejections([...rejections, nextNode + 1]);
                  }
                  if (nextNode + 1 === receiver) {
                    setIsTransferring(false);
                    toast.success(
                      `Packet successfully transferred to Node ${receiver}`
                    );
                  } else {
                    movePacket();
                  }
                }, 300);
              }
            };

            animatePacket();
          }
        };

        movePacket();
      } else if (topology === "Bus") {
        const backboneY = 100;
        let currentNodeIndex = sender - 1;

        const transferAlongBackbone = () => {
          if (currentNodeIndex !== receiver - 1) {
            const duration = 1000;
            const startTime = Date.now();

            const animateAlongBackbone = () => {
              const currentTime = Date.now();
              const progress = Math.min(
                (currentTime - startTime) / duration,
                1
              );

              const currentX = getX(currentNodeIndex);
              setPacketPosition({ x: currentX, y: backboneY });

              if (progress < 1) {
                requestAnimationFrame(animateAlongBackbone);
              } else {
                if (
                  currentNodeIndex + 1 !== sender &&
                  currentNodeIndex + 1 !== receiver
                ) {
                  if (
                    currentNodeIndex + 1 === numNodes &&
                    currentNodeIndex + 1 !== receiver &&
                    sender > receiver
                  )
                    setRejections((prev) => [...prev, numNodes]);
                  setRejections((prev) => [...prev, currentNodeIndex]);
                }

                if (sender > receiver) {
                  currentNodeIndex =
                    currentNodeIndex === numNodes - 1
                      ? 0
                      : currentNodeIndex + 1;
                } else {
                  currentNodeIndex++;
                }

                if (currentNodeIndex === receiver - 1) {
                  setIsTransferring(false);
                  setRejections((prev) =>
                    prev.filter((node) => node !== receiver)
                  );
                  toast.success(
                    `Packet successfully transferred to Node ${receiver}`
                  );
                } else {
                  setTimeout(transferAlongBackbone, 500);
                }
              }
            };

            animateAlongBackbone();
          }
        };

        const moveToBackbone = () => {
          const senderY = getY(sender - 1);
          const duration = 1000;
          const startTime = Date.now();

          const animateToBackbone = () => {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const currentY = senderY - progress * (senderY - backboneY);
            setPacketPosition({ x: getX(sender - 1), y: currentY });

            if (progress < 1) {
              requestAnimationFrame(animateToBackbone);
            } else {
              transferAlongBackbone();
            }
          };

          animateToBackbone();
        };

        moveToBackbone();
      } else if (topology === "Star") {
        if (sender === 1) {
          toast.error("Node 1 cannot be the sender in Star topology");
          return setIsTransferring(false);
        }

        const senderX = getX(sender - 1);
        const senderY = getY(sender - 1);
        const switchX = getX(0);
        const switchY = getY(0);

        const moveToSwitch = () => {
          const duration = 1000;
          const startTime = Date.now();

          const animateToSwitch = () => {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const currentX = senderX + progress * (switchX - senderX);
            const currentY = senderY + progress * (switchY - senderY);

            setPacketPosition({ x: currentX, y: currentY });

            if (progress < 1) {
              requestAnimationFrame(animateToSwitch);
            } else {
              setTimeout(() => {
                transferFromSwitch();
              }, 300);
            }
          };

          animateToSwitch();
        };

        const transferFromSwitch = () => {
          const receiverX = getX(receiver - 1);
          const receiverY = getY(receiver - 1);
          const duration = 1000;
          const startTime = Date.now();

          const animateToReceiver = () => {
            const currentTime = Date.now();
            const progress = Math.min((currentTime - startTime) / duration, 1);

            const currentX = switchX + progress * (receiverX - switchX);
            const currentY = switchY + progress * (receiverY - switchY);

            setPacketPosition({ x: currentX, y: currentY });

            if (progress < 1) {
              requestAnimationFrame(animateToReceiver);
            } else {
              setIsTransferring(false);
              toast.success(
                `Packet successfully transferred to Node ${receiver} from Switch`
              );
            }
          };

          animateToReceiver();
        };

        moveToSwitch();
      } else {
        const senderX = getX(sender - 1);
        const senderY = getY(sender - 1);
        const receiverX = getX(receiver - 1);
        const receiverY = getY(receiver - 1);

        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
          const currentTime = Date.now();
          const progress = Math.min((currentTime - startTime) / duration, 1);

          const currentX = senderX + progress * (receiverX - senderX);
          const currentY = senderY + progress * (receiverY - senderY);

          setPacketPosition({ x: currentX, y: currentY });

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setIsTransferring(false);
            toast.success(
              `Packet successfully transferred to Node ${receiver}`
            );
          }
        };
        animate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTransferring, sender, receiver]);

  const handlePacketTransfer = () => {
    if (sender === receiver)
      return toast.error("Sender and receiver cannot be the same node");
    else if (
      sender < 1 ||
      sender > numNodes ||
      receiver < 1 ||
      receiver > numNodes
    )
      return toast.error("Invalid node number");
    setIsTransferring(true);
    setRejections([]);
  };

  const renderConnections = () => {
    switch (topology) {
      case "Mesh":
        return renderMeshConnections();
      case "Star":
        return renderStarConnections();
      case "Ring":
        return renderRingConnections();
      case "Bus":
        return renderBusConnections();
      default:
        return null;
    }
  };

  const renderMeshConnections = () => (
    <>
      {Array.from({ length: numNodes }, (_, i) =>
        Array.from({ length: numNodes }, (_, j) =>
          i !== j ? (
            <line
              key={`${i}-${j}`}
              x1={getX(i)}
              y1={getY(i)}
              x2={getX(j)}
              y2={getY(j)}
              stroke="black"
              strokeWidth="2"
            />
          ) : null
        )
      )}
    </>
  );

  const renderStarConnections = () => {
    const centerX = getX(0);
    const centerY = getY(0);

    return (
      <>
        {Array.from({ length: 2 }, (_, i) => (
          <line
            key={`star-left-${i}`}
            x1={centerX}
            y1={centerY}
            x2={getX(i + 1)}
            y2={getY(i + 1)}
            stroke="black"
            strokeWidth="2"
          />
        ))}

        {Array.from({ length: 2 }, (_, i) => (
          <line
            key={`star-right-${i}`}
            x1={centerX}
            y1={centerY}
            x2={getX(i + 3)}
            y2={getY(i + 3)}
            stroke="black"
            strokeWidth="2"
          />
        ))}
      </>
    );
  };

  const renderRingConnections = () => (
    <>
      {Array.from({ length: numNodes }, (_, i) => (
        <line
          key={`ring-${i}`}
          x1={getX(i)}
          y1={getY(i)}
          x2={getX((i + 1) % numNodes)}
          y2={getY((i + 1) % numNodes)}
          stroke="black"
          strokeWidth="2"
        />
      ))}
    </>
  );

  const renderBusConnections = () => (
    <>
      <line
        x1={100}
        y1={100}
        x2={100 + (numNodes + 1) * 100}
        y2={100}
        stroke="black"
        strokeWidth="2"
      />

      {Array.from({ length: numNodes }, (_, i) => (
        <line
          key={`bus-${i}`}
          x1={100 + i * 100}
          y1={200}
          x2={100 + i * 100}
          y2={100}
          stroke="black"
          strokeWidth="2"
        />
      ))}
    </>
  );

  const getX = (index: number) => {
    switch (topology) {
      case "Mesh":
      case "Ring":
        return 200 + 150 * Math.cos((2 * Math.PI * index) / numNodes);
      case "Star":
        return index === 0 ? 200 : 100 + (index % 2) * 200;
      case "Bus":
        return 100 + index * 100;
      default:
        return 200;
    }
  };

  const getY = (index: number) => {
    switch (topology) {
      case "Mesh":
      case "Ring":
        return 200 + 150 * Math.sin((2 * Math.PI * index) / numNodes);
      case "Star":
        return index === 0 ? 200 : index <= 2 ? 100 : 300;
      case "Bus":
        return 200;
      default:
        return 200;
    }
  };

  return (
    <div
      className={`h-screen max-w-full flex flex-col items-center p-6 text-gray-700 ${
        topology === "Bus"
          ? "max-md:overflow-x-scroll"
          : "max-md:overflow-x-hidden"
      }`}
    >
      <h1 className="text-4xl font-bold mb-6 text-gray-800 max-sm:text-center max-md:text-3xl">
        Network Topology Visualizer
      </h1>

      <TopologySelector
        topology={topology}
        setTopology={setTopology}
        topologies={topologies}
      />

      <NodeInput
        sender={sender}
        receiver={receiver}
        setSender={setSender}
        setReceiver={setReceiver}
        numNodes={numNodes}
        handlePacketTransfer={handlePacketTransfer}
      />
      <TopologyVisualizer
        topology={topology}
        numNodes={numNodes}
        renderConnections={renderConnections}
        getX={getX}
        getY={getY}
        sender={sender}
        receiver={receiver}
        packetPosition={packetPosition}
        isTransferring={isTransferring}
        rejections={rejections}
      />
    </div>
  );
};

export default VisualizerPage;
