import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FolderProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  isRoot?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  toolbar?: ReactNode;
}

export function Folder({ title, children, defaultOpen = true, isRoot = false, onOpenChange, toolbar }: FolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  const iconTransition = { type: 'spring' as const, visualDuration: 0.4, bounce: 0.1 };
  const panelTransition = { type: 'spring' as const, visualDuration: 0.4, bounce: 0.2 };

  // Track content height for explicit panel sizing (no height: 'auto')
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      // Only update while open — freeze height when closing so it doesn't shrink mid-animation
      if (isOpen) {
        const h = el.offsetHeight;
        setContentHeight(prev => prev === h ? prev : h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const folderContent = (
    <div ref={isRoot ? contentRef : undefined} className={`dialkit-folder ${isRoot ? 'dialkit-folder-root' : ''}`}>
      <div className={`dialkit-folder-header ${isRoot ? 'dialkit-panel-header' : ''}`} onClick={() => { const next = !isOpen; setIsOpen(next); if (next) setIsCollapsed(false); onOpenChange?.(next); }}>
        <div className="dialkit-folder-header-top">
          {isRoot ? (
            <AnimatePresence initial={false} mode="popLayout">
              {isOpen && (
                <motion.div
                  className="dialkit-folder-title-row"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="dialkit-folder-title dialkit-folder-title-root">
                    {title}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="dialkit-folder-title-row">
              <span className="dialkit-folder-title">
                {title}
              </span>
            </div>
          )}
          {isRoot ? (
            // Root panel icon — fixed position, container morphs around it
            <svg
              className="dialkit-panel-icon"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path opacity="0.5" d="M6.84766 11.75C6.78583 11.9899 6.75 12.2408 6.75 12.5C6.75 12.7592 6.78583 13.0101 6.84766 13.25H2C1.58579 13.25 1.25 12.9142 1.25 12.5C1.25 12.0858 1.58579 11.75 2 11.75H6.84766ZM14 11.75C14.4142 11.75 14.75 12.0858 14.75 12.5C14.75 12.9142 14.4142 13.25 14 13.25H12.6523C12.7142 13.0101 12.75 12.7592 12.75 12.5C12.75 12.2408 12.7142 11.9899 12.6523 11.75H14ZM3.09766 7.25C3.03583 7.48994 3 7.74075 3 8C3 8.25925 3.03583 8.51006 3.09766 8.75H2C1.58579 8.75 1.25 8.41421 1.25 8C1.25 7.58579 1.58579 7.25 2 7.25H3.09766ZM14 7.25C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75H8.90234C8.96417 8.51006 9 8.25925 9 8C9 7.74075 8.96417 7.48994 8.90234 7.25H14ZM7.59766 2.75C7.53583 2.98994 7.5 3.24075 7.5 3.5C7.5 3.75925 7.53583 4.01006 7.59766 4.25H2C1.58579 4.25 1.25 3.91421 1.25 3.5C1.25 3.08579 1.58579 2.75 2 2.75H7.59766ZM14 2.75C14.4142 2.75 14.75 3.08579 14.75 3.5C14.75 3.91421 14.4142 4.25 14 4.25H13.4023C13.4642 4.01006 13.5 3.75925 13.5 3.5C13.5 3.24075 13.4642 2.98994 13.4023 2.75H14Z" fill="currentColor"/>
              <circle cx="6" cy="8" r="0.998596" fill="currentColor" stroke="currentColor" strokeWidth="1.25"/>
              <circle cx="10.4999" cy="3.5" r="0.998657" fill="currentColor" stroke="currentColor" strokeWidth="1.25"/>
              <circle cx="9.75015" cy="12.5" r="0.997986" fill="currentColor" stroke="currentColor" strokeWidth="1.25"/>
            </svg>
          ) : (
            // Section folders use rotating chevron with gentle spring
            <motion.svg
              className="dialkit-folder-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ type: 'spring', visualDuration: 0.35, bounce: 0.15 }}
            >
              <path d="M6 9.5L12 15.5L18 9.5" />
            </motion.svg>
          )}
        </div>

        {isRoot && toolbar && (
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div className="dialkit-panel-toolbar" onClick={(e) => e.stopPropagation()}>
                  {toolbar}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="dialkit-folder-content"
            initial={isRoot ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={isRoot ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={isRoot ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={isRoot ? { duration: 0.15 } : { type: 'spring', visualDuration: 0.35, bounce: 0.1 }}
            style={isRoot ? undefined : { overflow: 'hidden' }}
          >
            <div className="dialkit-folder-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // For root folders, wrap in animated panel container
  if (isRoot) {
    return (
      <motion.div
        className="dialkit-panel-inner"
        initial={false}
        animate={{
          width: isOpen ? 280 : 42,
          height: isOpen ? (contentHeight !== undefined ? contentHeight + 24 : 'auto') : 42,
          borderRadius: isOpen ? 14 : 21,
          boxShadow: isOpen
            ? '0 8px 32px rgba(0, 0, 0, 0.5)'
            : '0 4px 16px rgba(0, 0, 0, 0.25)',
        }}
        transition={panelTransition}
        style={{ overflow: isOpen ? undefined : 'hidden', cursor: isOpen ? undefined : 'pointer' }}
        onClick={!isOpen ? () => { setIsOpen(true); setIsCollapsed(false); onOpenChange?.(true); } : undefined}
        onAnimationComplete={() => { if (!isOpen) setIsCollapsed(true); }}
        data-collapsed={isCollapsed}
      >
        {folderContent}
      </motion.div>
    );
  }

  return folderContent;
}
