import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function UserLayout({ children, params }) {
  const { id } = params;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16">{children}</main>
      <Footer id={id} />
    </div>
  );
}
