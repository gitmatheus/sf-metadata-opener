import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

/**
 * Gets the authenticated default Salesforce org's base domain
 */
export async function getOrgDomain(): Promise<string> {
  try {
    const { stdout } = await execPromise('sfdx org display --json');
    const json = JSON.parse(stdout);

    if (!json.result?.instanceUrl) {
      throw new Error('No default org set or instanceUrl not found');
    }

    return json.result.instanceUrl;
  } catch {
    throw new Error('Unable to determine default org. Run `sfdx org login web --set-default` first.');
  }
}
