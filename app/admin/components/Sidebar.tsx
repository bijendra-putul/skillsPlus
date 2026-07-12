"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"
        />
      </svg>
    ),
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        />
      </svg>
    ),
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857"
        />
      </svg>
    ),
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
        />
      </svg>
    ),
  },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}


export default function Sidebar({isOpen,onClose}:SidebarProps){

const pathname = usePathname();
const router = useRouter();


const handleLogout = ()=>{
 localStorage.clear();
 router.replace("/login");
};


const isActive=(href:string)=>{
 if(href==="/admin")
   return pathname==="/admin";

 return pathname.startsWith(href);
};


return (

<aside
className={`
fixed top-0 left-0 h-full w-64
bg-[#13151f] border-r border-white/5
flex flex-col z-30
transition-transform duration-300
${isOpen ? "translate-x-0":"-translate-x-full"}
lg:translate-x-0
`}
>


<div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">

<div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">

<span className="text-white font-bold">
J
</span>

</div>


<div>
<p className="text-white font-semibold text-sm">
JobPortal
</p>

<p className="text-indigo-400 text-xs">
Admin Panel
</p>
</div>


<button
onClick={onClose}
className="ml-auto lg:hidden text-slate-400"
>
✕
</button>

</div>



<nav className="flex-1 px-3 py-4 space-y-1">

{
navItems.map((item)=>(
<Link
key={item.href}
href={item.href}
onClick={onClose}
className={`
flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
${isActive(item.href)
?"bg-indigo-500/10 text-indigo-400"
:"text-slate-400 hover:text-white hover:bg-white/5"}
`}
>

<span>
{item.icon}
</span>

{item.label}

</Link>
))
}

</nav>



<div className="px-3 py-4 border-t border-white/5">

<Link
href="/"
target="_blank"
className="block px-3 py-2 text-slate-400 hover:text-white"
>
View Website
</Link>


<button
onClick={handleLogout}
className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-500/10"
>
Logout
</button>


</div>


</aside>

);

}