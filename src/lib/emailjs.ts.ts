import emailjs from '@emailjs/browser';

export const EMAILJS_CONFIG = {
  serviceId: 'service_8h5whqv',
  templateId: 'template_m807jwi',     // notificación al admin
  autoReplyTemplateId: 'template_e8hsk5o',
  publicKey: 'rAsaRsAxvEXqL6o9T',
};

export const sendExcelAccessRequest = async (userName: string, userEmail: string) => {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      {
        to_email: 'iaacademy.edu@gmail.com',
        user_name: userName,
        user_email: userEmail,
        subject: 'Solicitud de acceso al curso Excel Avanzado',
        message: `El usuario ${userName} (${userEmail}) solicita acceso al curso.`,
      },
      EMAILJS_CONFIG.publicKey
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};

export const sendAutoResponse = async (userName: string, userEmail: string) => {
  try {
    await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.autoReplyTemplateId,
      {
        to_email: userEmail,
        user_name: userName,
        subject: 'Solicitud de acceso recibida',
        message: `Hola ${userName}, hemos recibido tu solicitud. En breve recibirás respuesta.`,
      },
      EMAILJS_CONFIG.publicKey
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};