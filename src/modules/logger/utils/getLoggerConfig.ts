import pino from 'pino';
import { format } from 'date-fns';
import { LOG_LEVELS } from '../constants';
import { checkIfDirExists } from './checkIfDirExists';

export const getLoggerConfig = (directoryName: string) => {
  checkIfDirExists(directoryName).then();

  const date = format(Date.now(), 'yyyy-MM-dd');
  const dest = `./${directoryName}/${date}`;

  return pino(
    {
      level: process.env.PINO_LOG_LEVEL || 'info',
      customLevels: LOG_LEVELS,
      useOnlyCustomLevels: true,
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
    },
    pino.destination({
      dest,
      sync: false,
    }),
  );
};
