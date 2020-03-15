
export interface ICallSnackProps {


  /**
   * Translate to locale string
   */
  t?: (state: any, params?: any) => any

  avatarURL: string
  soundURL: string
  title: string,
  subtitle: string
  onClose: (userId: string) => void
  onConnect: (userId: string) => void
  userId: string
  /**
   * Styles
   */
  classes?: any
}
