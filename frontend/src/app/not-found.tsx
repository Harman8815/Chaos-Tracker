'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NotFound() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary/20 via-transparent to-transparent" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative z-10 text-center px-6"
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="mb-6"
                >
                    <span className="text-8xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        404
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                >
                    Page Not Found
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-accent-primary/80 max-w-md mx-auto mb-8 text-lg"
                >
                    The page you are looking for doesn&apos;t exist or has been moved.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover text-white font-semibold transition-colors duration-200"
                    >
                        Go Home
                    </Link>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white/[0.06] hover:bg-accent-primary/35 text-white font-semibold transition-colors duration-200"
                    >
                        Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
