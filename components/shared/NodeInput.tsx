import PacketTransferButton from "./PacketTransferButton";

interface Props {
  sender: number;
  receiver: number;
  setSender: (e: number) => void;
  setReceiver: (e: number) => void;
  numNodes: number;
  handlePacketTransfer: () => void;
}

const NodeInput = ({
  sender,
  receiver,
  setSender,
  setReceiver,
  numNodes,
  handlePacketTransfer,
}: Props) => (
  <div className="mb-6 flex gap-5 items-center">
    <div>
      <label className="block text-lg font-semibold mb-2">Sender</label>
      <input
        type="number"
        value={sender}
        onChange={(e) => setSender(Number(e.target.value))}
        className="p-2 border border-gray-400 rounded-lg w-24"
        min="1"
        max={numNodes}
      />
    </div>

    <div>
      <label className="block text-lg font-semibold mb-2">Receiver</label>
      <input
        type="number"
        value={receiver}
        onChange={(e) => setReceiver(Number(e.target.value))}
        className="p-2 border border-gray-400 rounded-lg w-24"
        min="1"
        max={numNodes}
      />
    </div>

    <PacketTransferButton handlePacketTransfer={handlePacketTransfer} />
  </div>
);

export default NodeInput;
