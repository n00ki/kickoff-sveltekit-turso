// Env Variables
import { RESEND_API_KEY, EMAIL_SENDER } from '$env/static/private';

// Utils
import { fail } from '@sveltejs/kit';
import { render } from 'svelte-email';

// Packages
import { Resend } from 'resend';

// Templates
import WelcomeTemplate from '$lib/utils/mail/templates/Welcome.svelte';
import ResetPasswordTemplate from '$lib/utils/mail/templates/ResetPassword.svelte';

export const send_email = async (
  to: string,
  subject: string,
  template_name: string,
  template_data?: any
) => {
  if (to && subject && template_name) {
    // sendgrid.setApiKey(SENDGRID_API_KEY);
    const resend = new Resend(RESEND_API_KEY);

    let html;

    switch (template_name) {
      case 'Welcome':
        html = render({
          template: WelcomeTemplate
        });
        break;
      case 'ResetPassword':
        html = render({
          template: ResetPasswordTemplate,
          props: {
            url: template_data?.url
          }
        });
        break;
      default:
        return fail(402);
    }

    const options = {
      from: EMAIL_SENDER,
      to,
      subject,
      html
    };

    try {
      await resend.emails.send(options);
      console.log('Email sent successfully');
    } catch (error) {
      console.log('Error sending email', error);
    }
  }
};
