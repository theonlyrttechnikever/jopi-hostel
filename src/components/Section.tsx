import { type ReactNode } from "react"
import { Container } from "./Container"

export function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string
  title: string
  eyebrow?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-14 sm:py-16">
      <Container>
        <div className="mb-8">
          {eyebrow ? (
            <p className="text-xs font-semibold tracking-wide text-zinc-500">{eyebrow}</p>
          ) : null}
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            {title}
          </h2>
        </div>
        {children}
      </Container>
    </section>
  )
}
