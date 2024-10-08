import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() 
{
  const {data:session}=useSession();
  //if(!session) return;

  return(
    <Layout>
      <div className="text-orc flex justify-between"> 
        <h2>Hello, <b>{session?.user?.name}</b></h2>
        <div className="flex bg-tur0 gap-2 text-black rounded-lg overflow-hidden">
          <img src={session?.user?.image} alt="" className="w-6 h-6"/>
          <span className="px-2">
            {session?.user?.name}
          </span>
          
        </div>
      </div>
    </Layout>
 )
 
}

