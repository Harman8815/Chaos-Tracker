'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-error/20 via-transparent to-transparent" />

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
                    <span className="text-8xl font-extrabold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                        500
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
                >
                    Internal Server Error
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-text-secondary max-w-md mx-auto mb-8 text-lg"
                >
                    Something went wrong on our end. Please try again or return to a safe page.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={reset}
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-accent-primary hover:bg-accent-primary-hover text-text-inverse font-semibold transition-colors duration-200"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-input-bg hover:bg-border text-text-primary font-semibold transition-colors duration-200"
                    >
                        Go Home
                    </Link>
                </motion.div>

                {process.env.NODE_ENV === 'development' && error?.message && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 p-4 rounded-lg bg-card-bg border border-border text-left text-sm text-text-secondary max-w-lg mx-auto"
                    >
                        <p className="font-bold text-text-primary mb-2">Development Error Details</p>
                        <p className="break-words">{error.message}</p>
                        {error.digest && <p className="mt-2 text-xs opacity-70">Digest: {error.digest}</p>}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
