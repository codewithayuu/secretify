/**
 * Dark Glass Theme with Bouncy Animations - Tailwind CSS Classes
 * 
 * A beautiful, dark theme with glass morphism effects and bouncy animations
 */

export const theme = {
  // Base backgrounds
  background: {
    primary: 'bg-[var(--background)]',           // Main page background
    secondary: 'bg-[var(--blossom-light)]',      // Alternative background
    gradient: 'bg-gradient-to-br from-[var(--background)] via-gray-900 to-[var(--background)]', // Gradient background
  },

  // Container styles with beautiful glass effects
  container: {
    main: 'max-w-lg mx-auto px-4 py-8',
    section: 'max-w-lg mx-auto px-4',
    card: 'glass-effect rounded-2xl p-6 hover-lift transition-all duration-300',
    form: 'glass-effect rounded-2xl p-8 hover-lift transition-all duration-300',
  },

  // Input styles with glass effects
  input: {
    textarea: 'w-full p-4 border border-[var(--glass-border)] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-200 bg-[var(--glass-bg)] text-[var(--foreground)] placeholder-[var(--text-muted)] backdrop-blur-md hover:bg-[var(--card-bg-hover)]',
    text: 'w-full p-3 border border-[var(--glass-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-200 bg-[var(--glass-bg)] text-[var(--foreground)] backdrop-blur-md',
    select: 'w-full p-3 border border-[var(--glass-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-200 bg-[var(--glass-bg)] text-[var(--foreground)] backdrop-blur-md',
  },

  // Button styles with bouncy effects
  button: {
    primary: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)] hover:from-[var(--accent-dark)] hover:to-[var(--accent)] text-white font-semibold rounded-xl px-4 py-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105 active:scale-95',
    secondary: 'bg-[var(--glass-bg)] hover:bg-[var(--accent-light)] text-[var(--foreground)] font-medium rounded-lg px-4 py-2 transition-all duration-200 border border-[var(--glass-border)] backdrop-blur-md hover-lift',
    ghost: 'text-[var(--accent)] hover:text-[var(--accent-dark)] hover:bg-[var(--blossom-pink)] font-medium rounded-lg px-4 py-2 transition-all duration-200 hover-lift',
    danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 shadow-lg hover:shadow-xl hover-lift',
    disabled: 'bg-gray-600 text-gray-400 cursor-not-allowed rounded-lg px-4 py-2 transition-all duration-200',
  },

  // Confession card styles with glass and bounce
  card: {
    confession: 'glass-effect rounded-xl p-4 hover-lift transition-all duration-300',
    optimistic: 'bg-orange-900/20 backdrop-blur-md rounded-xl shadow-lg border border-orange-700/30 p-4 hover:shadow-xl transition-all duration-300',
    header: 'glass-effect rounded-2xl p-6 hover-lift transition-all duration-300',
  },

  // Text styles
  text: {
    primary: 'text-[var(--foreground)]',
    secondary: 'text-[var(--text-muted)]',
    muted: 'text-[var(--text-muted)]',
    accent: 'text-[var(--accent)]',
    error: 'text-red-400',
    success: 'text-green-400',
    warning: 'text-orange-400',
  },

  // Typography with serif elegance
  typography: {
    h1: 'text-4xl md:text-5xl font-extrabold text-[var(--foreground)] tracking-tight font-serif',
    h2: 'text-2xl md:text-3xl font-bold text-[var(--foreground)] font-serif',
    h3: 'text-xl md:text-2xl font-semibold text-[var(--accent)] font-serif',
    body: 'text-base text-[var(--foreground)] leading-relaxed font-serif',
    small: 'text-sm text-[var(--text-muted)] font-serif',
    italic: 'italic text-[var(--foreground)] font-serif',
  },

  // Status messages with glass effects
  status: {
    success: 'bg-green-900/30 text-green-300 p-3 rounded-lg text-center font-medium border border-green-700/30 backdrop-blur-md',
    error: 'bg-red-900/30 text-red-300 p-3 rounded-lg text-center font-medium border border-red-700/30 backdrop-blur-md',
    warning: 'bg-orange-900/30 text-orange-300 p-3 rounded-lg text-center font-medium border border-orange-700/30 backdrop-blur-md',
    info: 'bg-blue-900/30 text-blue-300 p-3 rounded-lg text-center font-medium border border-blue-700/30 backdrop-blur-md',
  },

  // Progress bar with glass effects
  progress: {
    bar: 'w-full bg-[var(--glass-border)] rounded-full h-2.5 backdrop-blur-sm',
    fill: {
      success: 'bg-green-500',
      warning: 'bg-orange-400',
      error: 'bg-red-500',
      accent: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]',
    },
  },

  // Effects with enhanced glass and bounce
  effects: {
    gradient: 'bg-gradient-to-r from-[var(--accent)] to-[var(--accent-dark)]',
    shadow: 'shadow-lg hover:shadow-xl transition-all duration-300',
    border: 'border border-[var(--glass-border)]',
    glow: 'shadow-lg shadow-[var(--accent)]/20 hover:shadow-[var(--accent)]/30',
    blur: 'backdrop-blur-md',
    blurStrong: 'backdrop-blur-lg',
    glass: 'glass-effect',
    bounce: 'hover-lift',
  },

  // Layout
  layout: {
    grid: {
      twoCol: 'grid lg:grid-cols-2 gap-8',
    }
  }
};

export const components = {
  pageContainer: 'bg-[var(--background)] min-h-screen relative',
  submitButton: theme.button.primary + ' w-full py-4 px-8 text-lg',
  confessionCard: 'glass-effect rounded-2xl p-6 hover-lift transition-all duration-300',
  optimisticCard: 'bg-orange-900/20 backdrop-blur-lg rounded-2xl shadow-lg border border-orange-500/30 p-6 hover:shadow-xl transition-all duration-300',
  formContainer: 'glass-effect rounded-2xl p-8 hover-lift transition-all duration-300',
  header: 'glass-effect shadow-lg border-b border-[var(--glass-border)] sticky top-0 z-10',
  footer: 'glass-effect border-t border-[var(--glass-border)] text-center text-[var(--text-muted)] text-sm py-6 px-4 md:px-8',
  stackContainer: 'w-full',
};
