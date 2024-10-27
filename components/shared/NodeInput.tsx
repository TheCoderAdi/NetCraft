import PacketTransferButton from "./PacketTransferButton";

interface Props {
  sender: number;
  receiver: number;
  isTransfering: boolean;
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
  isTransfering,
}: Props) => (
  <div className="mb-6 flex gap-5 items-center justify-center max-sm:flex-col">
    <div className="flex flex-row gap-5">
      <div>
        <label className="block text-lg font-semibold mb-2">Sender</label>
        <input
          type="number"
          value={sender}
          onChange={(e) => setSender(Number(e.target.value))}
          className="p-2 border border-gray-400 rounded-lg w-24"
          min="1"
          max={numNodes}
          disabled={isTransfering}
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
          disabled={isTransfering}
        />
      </div>
    </div>
    <div className="self-end max-sm:self-center">
      <PacketTransferButton handlePacketTransfer={handlePacketTransfer} />
    </div>
  </div>
);

export default NodeInput;
