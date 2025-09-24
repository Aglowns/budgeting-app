import { motion } from 'framer-motion';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const AuthCard = ({ title, description, children }: AuthCardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-hero-gradient opacity-5"></div>
      <div className="absolute top-10 left-10 w-32 h-32 bg-secondary rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary rounded-full opacity-10 blur-3xl"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-uncp-gradient rounded-2xl mb-6 shadow-uncp-lg"
          >
            <span className="text-white font-bold text-3xl">UB</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold gradient-text mb-2"
          >
            UNCP Student Budgeting
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 text-lg font-medium"
          >
            Manage your finances like a <span className="text-primary font-bold">Brave</span> 🏹
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="card-uncp p-8 backdrop-blur-md">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">{description}</p>
            </div>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
