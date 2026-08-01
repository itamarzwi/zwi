import dayjs from 'dayjs';
import { NavLink } from 'react-router-dom';

import useSmoothMousePosition from '../../hooks/useSmoothMousePosition';
import { type ExperienceItem, experiences } from './experiences';

function Header() {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 pt-12">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          Itamar Zwi
        </h1>
        <h4 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
          Full Stack Developer
        </h4>
        <h6 className="mt-4 leading-normal max-w-md mb-8">
          I have a passion for puzzles and problem-solving, and I love sharing that passion with
          others
          <br />
          <br />
          <NavLink
            to="/minesweeper"
            className="text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
          >
            Check out my minesweeper game, with an auto player!
          </NavLink>
        </h6>
      </div>

      <div>
        <h6 className="mb-4 leading-normal max-w-md">
          Design by <Link href="https://brittanychiang.com/">Brittany Chiang</Link>
        </h6>
        <ul className="flex items-center gap-5" aria-label="Social media">
          <li>
            <a
              className="block hover:text-slate-200"
              href="https://github.com/JasonMan34"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub (opens in a new tab)"
              title="GitHub"
            >
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className="block hover:text-slate-200"
              href="https://www.linkedin.com/in/itamar-zwi/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn (opens in a new tab)"
              title="LinkedIn"
            >
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </a>
          </li>
          <li>
            <a
              className="block hover:text-slate-200"
              href="mailto:itamarzwi@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Send me an email"
              title="Email"
            >
              <span className="sr-only">Email</span>
              <svg
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 493.497 493.497"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M444.556,85.218H48.942C21.954,85.218,0,107.171,0,134.16v225.177c0,26.988,21.954,48.942,48.942,48.942h395.613
	c26.988,0,48.941-21.954,48.941-48.942V134.16C493.497,107.171,471.544,85.218,444.556,85.218z M460.87,134.16v225.177
	c0,2.574-0.725,4.924-1.793,7.09L343.74,251.081l117.097-117.097C460.837,134.049,460.87,134.096,460.87,134.16z M32.628,359.336
	V134.16c0-0.064,0.033-0.11,0.033-0.175l117.097,117.097L34.413,366.426C33.353,364.26,32.628,361.911,32.628,359.336z
	 M251.784,296.902c-2.692,2.691-7.378,2.691-10.07,0L62.667,117.846h368.172L251.784,296.902z M172.827,274.152l45.818,45.819
	c7.512,7.511,17.493,11.645,28.104,11.645c10.61,0,20.592-4.134,28.104-11.645l45.82-45.819l101.49,101.499H71.327L172.827,274.152z
	"
                />
              </svg>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}

// Seburska Marta Dimitrievna

function Link(props: React.ComponentPropsWithoutRef<'a'>) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      className="text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  );
}

function About() {
  return (
    <section id="about" className="mb-16 md:mb-24 lg:mb-36">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          About
        </h2>
      </div>
      I am a <Link href="https://www.linkedin.com/in/itamar-zwi/">Full Stack Developer</Link> with a
      passion for programming and logical puzzles. I fell in love with the world of programming when
      I was 14, and made a mod for the game{' '}
      <Link href="https://gmod.facepunch.com/">Garry&#39;s Mod</Link>. Since then, I&#39;ve
      continued to dive into the world of software development, eager to learn and improve as much
      as I can.
    </section>
  );
}

function ExperienceCard(props: ExperienceItem) {
  const { company, description, tags, title } = props;
  const start = dayjs(props.start).format('MM/YYYY');
  const end = !props.end ? 'Present' : dayjs(props.end).format('MM/YYYY');

  return (
    <li className="mb-12">
      <div className="grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:bg-slate-800/50 lg:hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg">
        <header
          className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2"
          aria-label={`${start} to ${end}`}
        >
          {start} —<br className="hidden lg:block" /> {end}
        </header>
        <div className="z-10 sm:col-span-6">
          <h3 className="font-medium leading-snug text-slate-200">
            <div>
              <span className="inline-flex items-baseline font-medium leading-tight text-slate-200 text-base">
                {title} · {company}
              </span>
            </div>
            <div>
              <div className="text-slate-500" aria-hidden="true">
                {title}
              </div>
            </div>
          </h3>
          <p className="mt-2 text-sm leading-normal">{description}</p>
          <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
            {tags.map((tag) => (
              <li className="mr-1.5 mt-2" key={tag.name}>
                <a
                  className="flex items-center rounded-full bg-teal-400/10 text-teal-300 hover:bg-teal-400/15 hover:text-teal-400 px-3 py-1 text-xs leading-5"
                  href={tag.link}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${tag.name} (opens in a new tab)`}
                  title={tag.name}
                >
                  {tag.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

function Experience() {
  return (
    <section id="experience" aria-label="Work experience">
      <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
          Experience
        </h2>
      </div>
      <div>
        <ol>
          {experiences.map((exp) => (
            <ExperienceCard key={exp.start.getTime()} {...exp} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Main() {
  return (
    <main className="pt-24 lg:w-1/2 lg:py-24">
      <About />
      <Experience />
    </main>
  );
}

function GradientOnMouse() {
  const mousePos = useSmoothMousePosition();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300 h-[100%]"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  );
}

function Home() {
  return (
    <>
      <div
        id="home"
        className="lg:flex lg:justify-between lg:gap-4 max-w-screen-xl mx-auto min-h-screen px-6 md:px-12 lg:px-24"
      >
        <Header />
        <Main />
      </div>

      <GradientOnMouse />
    </>
  );
}

export default Home;
