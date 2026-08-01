export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="no-print mt-8 border-t border-[var(--line)] px-1.5 pb-8 pt-6 text-[var(--sea-ink-soft)] sm:mt-20 sm:px-4 sm:pb-14 sm:pt-10"
      data-print-hide
    >
      <div className="page-wrap text-center sm:text-left">
        <p className="m-0 text-sm">&copy; {year} OWS Last Briefing Generator</p>
      </div>
    </footer>
  )
}
