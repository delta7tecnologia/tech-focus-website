import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/5591982370332?text=Olá! Gostaria de mais informações sobre os serviços da Delta7."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse effect */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-25" />
      
      {/* Button content */}
      <div className="relative flex items-center gap-3 px-4 py-3">
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:block font-medium pr-1">
          Fale Conosco
        </span>
      </div>
    </motion.a>
  );
};

export default WhatsAppButton;
