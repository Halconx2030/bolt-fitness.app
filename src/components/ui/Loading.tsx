import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <motion.div
        className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
