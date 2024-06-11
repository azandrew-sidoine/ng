export type Dialog = {
  /** @description Prompt a user to confirm an action */
  confirm(message: string): Promise<boolean>;
};
