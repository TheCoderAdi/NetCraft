import { Button } from "@/components/ui/button";

interface Props {
  handlePacketTransfer: () => void;
}

const PacketTransferButton = ({ handlePacketTransfer }: Props) => (
  <Button
    onClick={handlePacketTransfer}
    className="px-6 py-2 rounded-lg hover:bg-gray-800 w-40 h-12"
  >
    Send Packet
  </Button>
);

export default PacketTransferButton;
