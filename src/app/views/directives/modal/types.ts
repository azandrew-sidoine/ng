/**
 * Modal component type reference
 */
export type ModalElement = {
  /**
   * Manually closes the modal.
   */
  close(): void;

  /**
   * Manually opens the modal.
   */
  open(): void;
};


/**
 * Modal size type declaration
 */
export type SizeType = 'sm' | 'lg' | 'xl' | 'full';