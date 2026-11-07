import Banner from "@/components/home/Banner";
import Featured from "@/components/home/Featured";
import Newsletter from "@/components/home/Newsletter";
import OldEvents from "@/components/home/OldEvents";
import OurWork from "@/components/home/OurWork";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
   
      <Banner />
      <Featured />
      <OurWork />
      <OldEvents />
      <Newsletter />
    </div>
  );
}