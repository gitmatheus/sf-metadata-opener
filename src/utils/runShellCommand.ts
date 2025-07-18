import * as cp from "child_process";

/**
 * Executes a shell command and returns the output as a string
 */
export async function runShellCommand(cmd: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    cp.exec(cmd, (err, out) => {
      if (err) {
        reject(err);
      }
      resolve(out);
    });
  });
}