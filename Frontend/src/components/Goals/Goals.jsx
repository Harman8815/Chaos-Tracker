import React from 'react';
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const goalsData = [
  {
    month: 'January',
    achieved: ['Completed Portfolio Redesign', 'Learned TypeScript'],
    pending: ['Start Blogging'],
  },
  {
    month: 'February',
    achieved: ['Published SaaS Landing Page', 'Contributed to Open Source'],
    pending: ['Build CI/CD Pipeline'],
  },
  {
    month: 'March',
    achieved: ['Created Gmail Clone UI', 'Integrated Redux Toolkit'],
    pending: ['Add Unit Testing'],
  },
  {
    month: 'April',
    achieved: ['Built IDS Detection Backend', 'Dockerized Services'],
    pending: ['Train ML Model on NSL-KDD'],
  },
  {
    month: 'May',
    achieved: ['Completed College', 'Started Learning Laravel'],
    pending: ['Deploy Fullstack App on Railway'],
  },
  {
    month: 'June',
    achieved: ['Revamped Chaos Tracker', 'Studied MQTT Protocol'],
    pending: ['Write Blog on MQTT vs HTTP'],
  },
];

const Goals = () => {
  return (
    <div className="bg-primary-dark min-h-screen py-12 px-6 md:px-16 text-white font-sans">
      <h2 className="text-3xl font-bold text-center mb-12 text-gradient-to-r from-gradientStartPink to-gradientEndPink shadow-white-glow">
        Monthly Goals Timeline
      </h2>

      <div className="relative border-l-4 border-gradientPink pl-6 space-y-12">
        {goalsData.map((goal, index) => (
          <div key={index} className="relative">
            <div className="absolute left-[-10px] top-1.5 w-4 h-4 bg-gradient-to-br from-gradientStartPink to-gradientEndPink rounded-full border-2 border-white shadow-md"></div>

            <h3 className="text-xl font-bold text-pink-300">{goal.month}</h3>

            <div className="ml-4 mt-2 space-y-1">
              {goal.achieved.map((item, i) => (
                <p key={i} className="flex items-center gap-2 text-green-400">
                  <FaCheckCircle /> {item}
                </p>
              ))}

              {goal.pending.map((item, i) => (
                <p key={i} className="flex items-center gap-2 text-yellow-400">
                  <FaRegCircle /> {item}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;
