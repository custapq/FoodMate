import Link from "next/link";

export default function Footer({ id }) {
  return (
    <footer className="bg-white text-black mt-4 fixed bottom-0 w-full border-t-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <Link href={`/user/${id}/history`} className="text-center flex-1">
            <div className="p-2">
              <span>History</span>
            </div>
          </Link>

          <Link href={`/recommendation/${id}`} className="text-center flex-1">
            <div className="p-2">
              <span>Recommendation</span>
            </div>
          </Link>

          <Link href={`/user/${id}`} className="text-center flex-1">
            <div className="p-2">
              <span>Info</span>
            </div>
          </Link>
        </div>
      </div>
    </footer>
  );
} 