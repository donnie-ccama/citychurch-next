import type { DtkLang, DtkPage } from './pages.ts';

// Every kit UI string outside the kit HTML files, in both languages.
// English strings match what the English kit showed before Spanish existed.
export type DtkCopy = {
  pageTitle: string;
  switchLabel: string;
  heroAlt: Record<DtkPage, string>;
  gateTitle: string;
  gateIntro: string;
  gatePending: (email: string) => string;
  gateNoAccess: (email: string) => string;
  alreadyApproved: string;
  logIn: string;
  formName: string;
  formEmail: string;
  formNote: string;
  formSubmit: string;
  formSending: string;
  formReceived: string;
  formGenericError: string;
  errName: string;
  errEmail: string;
  errTooLong: string;
  loginTitle: string;
  loginPassword: string;
  loginSigningIn: string;
  loginFailed: string | null;
  forgotPassword: string;
  forgotNeedEmail: string;
  forgotSent: string;
  setTitle: string;
  setChecking: string;
  setNewPassword: string;
  setSave: string;
  setSaving: string;
  setTooShort: string;
  setExpired: string;
  setResetLink: string;
};

export const DTK_COPY: Record<DtkLang, DtkCopy> = {
  en: {
    pageTitle: 'Discipleship Training Kit | Citychurch',
    switchLabel: 'Language',
    heroAlt: {
      index: 'A small group of adults sitting in a circle with open Bibles, listening as one woman speaks',
      pitfalls: 'A small group around a table listening closely as one man shares, a friend’s hand on his shoulder',
      training: 'Group leaders around a table with Bibles and notebooks as one woman leads the discussion',
      toolkit: 'Three women praying together with joined hands beside an open Bible',
      sources: 'Hands resting on open Bibles and notebooks across a wooden table',
    },
    gateTitle: 'Discipleship Training Kit',
    gateIntro:
      'Training for launching discipleship groups among our staff and volunteers: common pitfalls, a six-session training plan, and a weekly group toolkit. Access is by approval.',
    gatePending: (email) => `You're signed in as ${email}. Your request is waiting for approval.`,
    gateNoAccess: (email) => `You're signed in as ${email}, but this account doesn't have access yet.`,
    alreadyApproved: 'Already approved?',
    logIn: 'Log in',
    formName: 'Name',
    formEmail: 'Email',
    formNote: 'Note (optional)',
    formSubmit: 'Request access',
    formSending: 'Sending...',
    formReceived: 'Request received. An admin will review it.',
    formGenericError: 'Something went wrong. Please try again.',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email address.',
    errTooLong: 'Your name or note is too long.',
    loginTitle: 'Discipleship Training Kit login',
    loginPassword: 'Password',
    loginSigningIn: 'Signing in...',
    loginFailed: null,
    forgotPassword: 'Forgot password?',
    forgotNeedEmail: 'Enter your email above, then click "Forgot password?" again.',
    forgotSent: 'Check your email for a link to set a new password.',
    setTitle: 'Set your password',
    setChecking: 'Checking your link...',
    setNewPassword: 'New password',
    setSave: 'Save password',
    setSaving: 'Saving...',
    setTooShort: 'Use at least 8 characters.',
    setExpired:
      'This link is invalid or has expired. Use "Forgot password?" on the login page to get a new one.',
    setResetLink:
      'This reset link didn\'t work. Open it in the same browser where you clicked "Forgot password?", or request a new one there.',
  },
  es: {
    pageTitle: 'Kit de Capacitación en Discipulado | Citychurch',
    switchLabel: 'Idioma',
    heroAlt: {
      index: 'Un grupo pequeño de adultos sentados en círculo con sus Biblias abiertas, escuchando a una mujer que habla',
      pitfalls: "Un grupo pequeño alrededor de una mesa escuchando con atención a un hombre que comparte, con la mano de una amiga sobre su hombro",
      training: 'Líderes de grupo alrededor de una mesa con Biblias y cuadernos mientras una mujer dirige la conversación',
      toolkit: 'Tres mujeres orando juntas tomadas de las manos junto a una Biblia abierta',
      sources: 'Manos sobre Biblias abiertas y cuadernos en una mesa de madera',
    },
    gateTitle: 'Kit de Capacitación en Discipulado',
    gateIntro:
      'Capacitación para lanzar grupos de discipulado entre nuestro personal y voluntarios: errores comunes, un plan de capacitación de seis sesiones y herramientas para el grupo semanal. El acceso requiere aprobación.',
    gatePending: (email) => `Inició sesión como ${email}. Su solicitud está esperando aprobación.`,
    gateNoAccess: (email) => `Inició sesión como ${email}, pero esta cuenta todavía no tiene acceso.`,
    alreadyApproved: '¿Ya tiene acceso?',
    logIn: 'Iniciar sesión',
    formName: 'Nombre',
    formEmail: 'Correo electrónico',
    formNote: 'Nota (opcional)',
    formSubmit: 'Solicitar acceso',
    formSending: 'Enviando...',
    formReceived: 'Solicitud recibida. Un administrador la revisará.',
    formGenericError: 'Algo salió mal. Inténtelo de nuevo.',
    errName: 'Escriba su nombre.',
    errEmail: 'Escriba un correo electrónico válido.',
    errTooLong: 'Su nombre o nota es demasiado largo.',
    loginTitle: 'Iniciar sesión en el Kit de Capacitación en Discipulado',
    loginPassword: 'Contraseña',
    loginSigningIn: 'Iniciando sesión...',
    loginFailed: 'El correo electrónico o la contraseña no son correctos.',
    forgotPassword: '¿Olvidó su contraseña?',
    forgotNeedEmail: 'Escriba su correo electrónico arriba y vuelva a hacer clic en "¿Olvidó su contraseña?".',
    forgotSent: 'Revise su correo electrónico. Le enviamos un enlace para crear una nueva contraseña.',
    setTitle: 'Cree su contraseña',
    setChecking: 'Revisando su enlace...',
    setNewPassword: 'Nueva contraseña',
    setSave: 'Guardar contraseña',
    setSaving: 'Guardando...',
    setTooShort: 'Use al menos 8 caracteres.',
    setExpired:
      'Este enlace no es válido o ya venció. Use "¿Olvidó su contraseña?" en la página de inicio de sesión para recibir uno nuevo.',
    setResetLink:
      'Este enlace para restablecer la contraseña no funcionó. Ábralo en el mismo navegador donde hizo clic en "¿Olvidó su contraseña?", o solicite uno nuevo allí.',
  },
};
