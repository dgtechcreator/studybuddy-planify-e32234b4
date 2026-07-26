import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-8 py-4 text-center text-sm text-muted-foreground">
      <p className="flex items-center justify-center gap-1 flex-wrap">
        <span>Developed with</span>
        <Heart size={14} className="text-red-500 fill-red-500" />
        <span>by DG-TECH Creator | VIVEK PAL</span>
      </p>
      <p className="text-xs mt-1">© 2026 StudyTracker. All rights reserved.</p>
    </footer>
  );
}
