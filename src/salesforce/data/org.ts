import { runShellCommand } from "../../utils/runners";

/**
 * Gets the authenticated default Salesforce org's unique ID.
 */
export async function getOrgId(): Promise<string> {
  const stdout = await runShellCommand("sf org list --json");
  const json = JSON.parse(stdout);

  const allOrgs = [
    ...(json.result?.nonScratchOrgs || []),
    ...(json.result?.scratchOrgs || []),
    ...(json.result?.sandboxes || []),
    ...(json.result?.other || []),
  ];

  const defaultOrg = allOrgs.find((org: any) => org.isDefaultUsername);

  if (!defaultOrg?.orgId) {
    throw new Error("Unable to determine default org ID.");
  }

  return defaultOrg.orgId;
}