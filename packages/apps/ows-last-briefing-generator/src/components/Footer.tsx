export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="no-print mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]"
      data-print-hide
    >
      <div className="page-wrap text-center sm:text-left">
        <p className="m-0 text-sm">&copy; {year} OWS Last Briefing Generator</p>
      </div>
    </footer>
  )
}
