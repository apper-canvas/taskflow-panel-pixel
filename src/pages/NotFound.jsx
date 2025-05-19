import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

function NotFound() {
  const ArrowLeftIcon = getIcon('arrow-left');
  const AlertTriangleIcon = getIcon('alert-triangle');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-surface-50 dark:bg-surface-900"
    >
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="text-center mb-8"
        >
          <div className="bg-surface-100 dark:bg-surface-800 mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <AlertTriangleIcon className="h-12 w-12 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-surface-100 mb-2">
            Page Not Found
          </h1>
          <p className="text-surface-600 dark:text-surface-400 text-lg">
            We couldn't find the page you were looking for
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/"
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-surface-500 dark:text-surface-500 text-sm"
        >
          <p>Need help? Contact support@taskflow.com</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default NotFound;