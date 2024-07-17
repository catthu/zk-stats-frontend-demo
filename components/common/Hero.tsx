import { Breadcrumb } from "@/types/request";
import Link from "next/link";

type HeroProps = {
  breadcrumb?: Array<Breadcrumb>;
  header: React.ReactNode;
  subheader?: string;
  action?: React.ReactNode
}

const Hero = (props: HeroProps) => {
  const { header, subheader, action, breadcrumb } = props;
  return (
    <div className="px-24 py-16 md:py-24 lg:py-32 text-start">
      {breadcrumb?.length && 
      <div className="mb-8 text-sm text-slate-900">
        {breadcrumb.map((path: Breadcrumb) => <Link key={path.label} href={path.href}>{ path.label }</Link>)}
      </div>
      }
      <h1 className="text-6xl md:text-8xl font-bold text-indigo-900 font-inter mb-6">
        { header }
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-8 font-inter">
        { subheader }
      </p>
      { action }
    </div>
  )
}

export const SmallHero = (props: HeroProps) => {
  const { breadcrumb, header, subheader } = props;
  // TODO ADD BREADCRUMB 
  return (
    <div className="px-24 py-8 md:py-8 lg:py-8 text-start">
      {breadcrumb?.length && 
      <div className="mb-8 text-sm text-slate-900">
        {breadcrumb.map((path: Breadcrumb) => <Link key={path.label} href={path.href}> { path.label } &gt;</Link>)}
      </div>
      }
      <h1 className="text-3xl md:text-3xl font-bold text-indigo-900 font-inter mb-2">
        { header }
      </h1>
      <p className="text-md md:text-xl text-gray-700 mb-4 font-inter">
        { subheader }
      </p>
    </div>
  )
}

export default Hero;
