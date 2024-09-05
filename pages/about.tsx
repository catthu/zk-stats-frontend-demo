import Hero, { SmallHero } from "@/components/common/Hero";
import Layout from "@/components/common/Layout";
import NavBar from "@/components/common/NavBar";

const About = () => {
  return (
    <div>
      <NavBar />
      <Hero
        header="About this page"
      />
      <Layout>
        <h1
          className="text-lg text-gray-800 font-bold mb-4 mt-6"
        >What are zero-knowledge datasets?</h1>
        <p>We host datasets that you can interact with using zero-knowledge proof. Zero-knowledge proof allows the data to remain private while offering the reassurance
          that the answers provided to you by the dataset owner is honest.  
        </p>
        <h1
          className="text-lg text-gray-800 font-bold mb-4 mt-6"
        >How does it work?</h1>
        <p>Datasets owners showcase their datasets with details necessary to write analyses functions. Dataset consumers who would like to perform certain analyses on a dataset write
          their analyses using the ZK stats libary and submit their function to the dataset owners. The analysis is converted to a Jupyter Notebook which the dataset owner
          can download and execute on the data stored locally on their computer. The results and proof of computation are uploaded. At no point does the data leaves the dataset
          owner&apos;s computer.
        </p>
        <h1
          className="text-lg text-gray-800 font-bold mb-4 mt-6"
        >Why is the proof necessary?</h1>
        <p>The proof ensures that the function has been executed as is, on a dataset specified in advance through a data commitment file, and that the result received is the result
          of that computation.
        </p>
        <h1
          className="text-lg text-gray-800 font-bold mb-4 mt-6"
        >Can I make / offer paid computation request?</h1>
        <p>We currently don&apos;t support paid computation requests, but it might be supported in the future.
        </p>
      </Layout>
    </div>
  )
}

export default About;