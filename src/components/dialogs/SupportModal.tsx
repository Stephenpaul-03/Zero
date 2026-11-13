import { useEffect, useRef, useState } from "react"
import { Check, Copy, Eye, ExternalLink, Github, Linkedin, QrCode, Globe, Heart } from "lucide-react"

import copy from "@/constants/ui-copy.json"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type SupportModalProps = { open: boolean; onOpenChange: (open: boolean) => void }

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const [isQrOpen, setIsQrOpen] = useState(false)
  const [isBlurred, setIsBlurred] = useState(true)
  const [copied, setCopied] = useState(false)
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { if (isQrOpen) setIsBlurred(true) }, [isQrOpen])
  useEffect(() => () => { if (copyTimeout.current) clearTimeout(copyTimeout.current) }, [])

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText("https://buymeacoffee.com")
      setCopied(true)
      if (copyTimeout.current) clearTimeout(copyTimeout.current)
      copyTimeout.current = setTimeout(() => setCopied(false), 1800)
    } catch { /* Clipboard access is optional. */ }
  }

  const socialLinks = [
    { label: copy.support.links.github, href: "https://github.com", icon: Github },
    { label: copy.support.links.linkedin, href: "https://linkedin.com", icon: Linkedin },
    { label: copy.support.links.portfolio, href: "https://portfolio.com", icon: Globe },
  ]

  return <>
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg overflow-hidden border-zinc-200 bg-white p-0 text-zinc-950 shadow-2xl dark:border-white/[0.1] dark:bg-[#08090c]/96 dark:text-zinc-100">
        <div className="border-b border-zinc-200 px-6 pb-5 pt-6 dark:border-white/[0.08] sm:px-8">
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-2xl font-semibold tracking-tight"><Heart className="size-5" />{copy.support.title}</DialogTitle><DialogDescription className="max-w-md pt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{copy.support.description}</DialogDescription></DialogHeader>
        </div>
        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="https://buymeacoffee.com" target="_blank" rel="noopener noreferrer" className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-zinc-50 dark:text-zinc-950">{copy.support.primaryAction}<ExternalLink className="size-3.5 transition-transform group-hover:translate-x-0.5" /></a>
            <Button variant="outline" onClick={() => setIsQrOpen(true)} className="h-11 gap-2 border-zinc-200 text-sm font-semibold dark:border-white/[0.1] dark:hover:bg-white/[0.06]"><QrCode className="size-4" />{copy.support.qrAction}</Button>
          </div>
          <button type="button" onClick={handleCopyLink} className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 py-2.5 text-xs font-medium text-zinc-500 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-white/[0.1] dark:hover:border-white/25 dark:hover:text-zinc-100">{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}{copied ? copy.support.copiedLabel : copy.support.copyAction}</button>
          <div className="space-y-3 border-t border-zinc-200 pt-5 dark:border-white/[0.08]"><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{copy.support.contactHeading}</p><div className="grid grid-cols-3 gap-2">{socialLinks.map(({ label, href, icon: Icon }) => <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="flex h-10 items-center justify-center gap-1.5 rounded-lg border border-zinc-200 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/[0.08] dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-zinc-100"><Icon className="size-3.5" />{label}</a>)}</div></div>
          <div className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-5 dark:border-white/[0.08]"><div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{copy.support.projectsHeading}</p><p className="mt-1 text-xs text-zinc-500">{copy.support.projectsDescription}</p></div><a href="https://portfolio.com/projects" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:underline dark:text-zinc-100">{copy.support.projectsAction}<ExternalLink className="size-3.5" /></a></div>
        </div>
      </DialogContent>
    </Dialog>
    <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
      <DialogContent className="flex max-w-sm flex-col items-center border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl dark:border-white/[0.1] dark:bg-[#08090c]/96 dark:text-zinc-100"><DialogHeader className="w-full text-center"><DialogTitle className="flex items-center justify-center gap-2 text-lg font-semibold"><QrCode className="size-5" />{copy.support.qrTitle}</DialogTitle><DialogDescription className="mx-auto mt-1 max-w-xs text-center text-xs text-zinc-500 dark:text-zinc-400">{copy.support.qrDescription}</DialogDescription></DialogHeader><div className="relative mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-white/[0.08] dark:bg-white/[0.03]"><img src="/qr_code.png" alt="Payment QR code" className={`size-56 rounded-lg object-cover transition-all duration-500 ${isBlurred ? "scale-95 blur-xl" : "scale-100 blur-0"}`} />{isBlurred && <button type="button" onClick={() => setIsBlurred(false)} className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/40 text-xs font-semibold text-zinc-900 backdrop-blur-sm dark:bg-black/40 dark:text-zinc-100"><span className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-white dark:bg-zinc-50 dark:text-zinc-950"><Eye className="size-4" />{copy.support.revealQr}</span><span className="text-[10px] uppercase tracking-wider text-zinc-600 dark:text-zinc-400">{copy.support.qrHint}</span></button>}</div></DialogContent>
    </Dialog>
  </>
}
