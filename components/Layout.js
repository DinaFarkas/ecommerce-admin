import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/components/Nav"

export default function Layout({children}) {

  const { data: session } = useSession();
  if(!session) {

      return (
      //bg=back-ground p je padding a px udaljenost teksta od boxa
      <div className="bg-blue-900 w-screen h-screen flex items-center">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg">Login with Google</button>
        </div>
      </div>
    );
  }
  
  return(
    <div className="bg-red-800 min-h-screen flex">
        <Nav/>
        <div className="bg-white flex-grow mt-2 mr-2 mb-2 rounded-md p-4">
            {children}
        </div>
    </div>
  );
}

