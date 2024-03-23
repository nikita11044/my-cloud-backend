import * as fse from 'fs-extra';

export const checkIfDirExists = async (directory: string) => {
  try {
    await fse.ensureDirSync(`./${directory}`);
  } catch (error) {
    console.error('Logs directory must be created');
  }
};
