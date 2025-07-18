/**
 * Determines whether the given Flow type supports being run in "Run Mode"
 */
export function shouldOfferRunMode(processType: string): boolean {
  return processType === "Flow";
}
