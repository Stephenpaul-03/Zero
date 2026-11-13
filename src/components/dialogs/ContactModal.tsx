import {
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import copy from "@/constants/ui-copy.json"

type ContactModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contactLinks = [
  {
    label: copy.contact.links.email,
    href: "mailto:stephenpaul4040@gmail.com",
    icon: Mail,
  },
  {
    label: copy.contact.links.linkedin,
    href: "https://www.linkedin.com/in/stephen-paul-i/",
    icon: Linkedin,
  },
  {
    label: copy.contact.links.github,
    href: "https://github.com/Stephenpaul-03",
    icon: Github,
  },
]

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-zinc-200 bg-white p-0 text-zinc-950 shadow-2xl dark:border-white/[0.1] dark:bg-[#08090c]/96 dark:text-zinc-100">
        <div className="border-b border-zinc-200 px-4 pb-5 pt-6 dark:border-white/[0.08] sm:px-8">
          <DialogHeader>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {copy.contact.eyebrow}
            </p>
            <DialogTitle className="flex items-center gap-2 pt-2 text-2xl font-semibold tracking-tight">
              <MessageCircle className="size-5" />
              {copy.contact.title}
            </DialogTitle>
            <DialogDescription className="max-w-md pt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              {copy.contact.description}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-4 pb-6 pt-0 sm:px-8">
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {copy.contact.note}
          </p>
          <div className="grid gap-3">
            {contactLinks.map(({ label, href, icon: Icon }, index) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  index === 0
                    ? "group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-zinc-50 dark:text-zinc-950"
                    : "group inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/[0.1] dark:text-zinc-300 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100"
                }
              >
                <Icon className="size-4" />
                {label}
                <ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
