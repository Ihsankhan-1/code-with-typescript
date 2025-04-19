import { ContainerScroll } from '@/components/global/container-scroll-animation';
import { InfiniteMovingCards } from '@/components/global/infinite-moving-cards';
import { Button } from '@/components/ui/button';
import { clients, products } from '@/lib/constant';
import { HeroParallax } from '@/components/global/connect-parallax';
import { LampComponent } from '@/components/global/lamp';
import { CardBody, CardContainer, CardItem } from '@/components/global/3d-card';
import { CheckIcon } from 'lucide-react';
import Navbar from '@/components/global/navbar';

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col max-w-[100vw] overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen w-full bg-neutral-950 rounded-md relative flex flex-col items-center antialiased px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 h-full w-full px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>

        <div className="flex flex-col mt-[-50px] md:mt-[-20px]">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col text-center">
                <Button
                  size={'lg'}
                  className="p-8 mb-6 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600 font-sans group-hover:bg-gradient-to-r group-hover:from-black group-hover:to-black">
                    Start For Free Today
                  </span>
                </Button>
                <h1 className="text-4xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold">
                  Automate Your Work With Fuzzie
                </h1>
              </div>
            }
          />
        </div>
      </section>

      {/* Moving Cards Section */}
      <section className="mt-16 md:mt-32 mb-16 overflow-hidden">
        <InfiniteMovingCards
          items={clients}
          direction="right"
          speed="slow"
          pauseOnHover={true} // Ensures pause on hover works
        />
      </section>

      {/* Hero Parallax Section */}
      <section className="relative overflow-hidden mt-16 md:mt-32">
        <HeroParallax products={products} />
      </section>

      {/* LampComponent Section */}
      <section className="relative overflow-hidden mt-19 md:mt-29">
        <LampComponent />
      </section>

      {/* Pricing Section */}
      <section className="mt-19 md:mt-29 px-4 md:px-6">
        <div className="flex flex-wrap items-center justify-center flex-col md:flex-row gap-6">
          {[
            { title: 'Hobby', price: '$0' },
            { title: 'Pro Plan', price: '$29' },
            { title: 'Unlimited', price: '$99' },
          ].map((plan, index) => (
            <CardContainer key={index} className="inter-var">
              <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:w-[350px] h-auto rounded-xl p-6 border">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {plan.title}
                  <h2 className="text-6xl">{plan.price}</h2>
                </CardItem>
                <CardItem
                  translateZ="60"
                  className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                >
                  Get a glimpse of what our software is capable of. Just a heads up {"you'll"} never
                  leave us after this!
                  <ul className="my-4 flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                      <CheckIcon /> 3 Free automations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> 100 tasks per month
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckIcon /> Two-step Actions
                    </li>
                  </ul>
                </CardItem>
                <div className="flex justify-between items-center mt-8">
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  >
                    Try now →
                  </CardItem>
                  <CardItem
                    translateZ={20}
                    as="button"
                    className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  >
                    Get Started Now
                  </CardItem>
                </div>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>
    </main>
  );
}
