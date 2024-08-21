// email.js

import { MailComposer } from 'expo';

const enviarCodigoVerificacion = async (correo, codigoVerificacion) => {
  try {
    await MailComposer.composeAsync({
      recipients: [correo],
      subject: 'Código de Verificación',
      body: `Tu código de verificación es: ${codigoVerificacion}`,
    });
    console.log('Correo electrónico enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
  }
};

export default enviarCodigoVerificacion;
