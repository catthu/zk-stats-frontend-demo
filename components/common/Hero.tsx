type HeroProps = {
  header: string;
  subheader?: string;
  action?: React.ReactNode
}

const Hero = (props: HeroProps) => {
  const { header, subheader, action } = props;
  return (
    <div className="bg-blue-100 px-4 py-16 md:py-24 lg:py-32 text-center">
      <h1 className="text-6xl md:text-8xl font-bold text-blue-800 font-inter mb-6">
        { header }
      </h1>
      <p className="text-xl md:text-2xl text-gray-700 mb-8 font-inter">
        { subheader }
      </p>
      { action }
    </div>
  )
}

export default Hero;