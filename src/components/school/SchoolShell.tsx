import Image from "next/image";
import Link from "next/link";
import { contact } from "@/content/ministry";
import { school } from "@/content/school";
import { SchoolHeader } from "./SchoolHeader";

/** Header, main landmark and footer for the school and the student dashboard, kept apart from the main site. */
export function SchoolShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchoolHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer className="mt-auto bg-slate-deep text-chalk/70">
        <div className="wrap flex flex-col gap-4 py-10 text-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Image
              src="/brand/beth-el-wordmark-light.png"
              alt={school.name}
              width={537}
              height={320}
              className="h-20 w-auto"
            />
            <p className="mt-3">
              A school of{" "}
              <Link href="/" className="font-semibold text-chalk/90 underline-offset-4 hover:text-flame hover:underline">
                Encounter Ground
              </Link>
            </p>
          </div>
          <a href={`mailto:${contact.email}`} className="self-start [overflow-wrap:anywhere] hover:text-flame lg:self-auto">
            {contact.email}
          </a>
          <p className="text-chalk/55">© {new Date().getFullYear()} Encounter Ground. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
