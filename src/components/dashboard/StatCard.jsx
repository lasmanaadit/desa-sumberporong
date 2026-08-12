// src/components/dashboard/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  description,
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
}) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        
        <div>
          <p className="font-label-md text-on-surface-variant">
            {title}
          </p>

          <h3 className="font-headline-lg text-on-surface mt-2">
            {value}
          </h3>

          <p className="font-label-sm text-on-surface-variant tracking-normal mt-1">
            {description}
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '25px' }}
          >
            {icon}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;