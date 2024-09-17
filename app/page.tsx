import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen  p-8 text-black font-sans">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          Discover <span className="text-purple-500">Network Topologies</span>
        </h1>

        <p className="text-lg max-w-2xl text-center text-gray-700 mb-8">
          Explore and visualize the structure of different network topologies
          such as Mesh, Star, Ring, and Bus. Understand their unique
          characteristics and how they operate.
        </p>

        <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Available Topologies
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>
              <b>Mesh:</b> All nodes are connected to each other, providing high
              redundancy.
            </li>
            <li>
              <b>Star:</b> All nodes are connected to a central hub, ensuring
              easy management.
            </li>
            <li>
              <b>Ring:</b> Each node connects to two others, forming a circular
              data path.
            </li>
            <li>
              <b>Bus:</b> Nodes are connected to a single communication line,
              reducing costs.
            </li>
          </ul>
        </div>
        <Link href={"/visualiser"}>
          <button
            className={`${buttonVariants({
              variant: "default",
            })} mt-8 w-40 h-14 rounded-full`}
          >
            Visualize Now
          </button>
        </Link>
      </div>
    </>
  );
}
