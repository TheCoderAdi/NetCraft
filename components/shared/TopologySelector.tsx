import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  topology: string;
  setTopology: (e: string) => void;
  topologies: string[];
}

const TopologySelector = ({ topology, setTopology, topologies }: Props) => (
  <div className="mb-6">
    <label className="block text-lg font-semibold mb-2">Select Topology</label>
    <Select onValueChange={(e) => setTopology(e)}>
      <SelectTrigger className="w-[180px] h-12 text-lg p-2 border border-gray-400 rounded-lg flex items-center justify-between">
        <SelectValue placeholder={topology} />
      </SelectTrigger>
      <SelectContent className="w-[180px] border border-gray-400 rounded-lg bg-white shadow-lg absolute">
        {topologies.map((top) => (
          <SelectItem key={top} value={top}>
            {top}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default TopologySelector;
