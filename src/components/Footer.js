import Link from "next/link";

export default function Footer({ id }) {
  return (
    <footer className="fixed bottom-0 w-full bg-white border-t">
      <nav className="container mx-auto">
        <div className="flex justify-around items-center h-16">
          <Link 
            href={`/user/${id}/history`} 
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-sm">ประวัติ</span>
          </Link>

          <Link 
            href={`/recommendation/${id}`}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-sm">แนะนำอาหาร</span>
          </Link>

          <Link 
            href={`/user/${id}`}
            className="flex flex-col items-center p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <span className="text-sm">ข้อมูลผู้ใช้</span>
          </Link>
        </div>
      </nav>
    </footer>
  );
} 