export const handler = async (event: any) => {
  // This function will receive webhook notifications from Netlify Forms
  // and send emails via a reliable email service

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const payload = JSON.parse(event.body);

    // Extract form data
    const formName = payload.form_name;
    const data = payload.data;
    const submittedAt = new Date().toISOString();

    console.log(`New ${formName} submission received:`, data);

    // Prepare email content based on form type
    let emailSubject = '';
    let emailContent = '';

    if (formName === 'contact-form-v2') {
      emailSubject = `New Contact Form Submission - ${data.subject || 'General Inquiry'}`;
      emailContent = `
New contact form submission received:

Name: ${data.name || 'Not provided'}
Email: ${data.email || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Subject: ${data.subject || 'Not provided'}
Message: ${data.message || 'Not provided'}

Submitted: ${submittedAt}
From: ${data['submitted-from'] || 'Website'}
Form Type: ${data['form-type'] || 'Contact'}
      `;
    } else if (formName === 'quote-form') {
      emailSubject = `New Quote Request - ${data.serviceType || 'Unknown Service'}`;
      emailContent = `
New quote request received:

Service Type: ${data.serviceType || 'Not specified'}
Waste Type: ${data.wasteType || 'Not specified'}
Volume: ${data.volumeEstimate || 'Not specified'}
Location: ${data.contactAddress || 'Not provided'}
Accessibility: ${data.accessibility || 'Not specified'}
Urgency: ${data.urgency || 'Not specified'}
Contact Email: ${data.contactEmail || 'Not provided'}
Quote ID: ${data.quoteId || 'Not generated'}

Submitted: ${submittedAt}
      `;
    } else if (formName === 'quote-request-form') {
      emailSubject = `New Large Job Quote Request - ${data.propertyType || 'Property'}`;
      emailContent = `
New large job quote request received:

Name: ${data.name || 'Not provided'}
Phone: ${data.phone || 'Not provided'}
Property Type: ${data.propertyType || 'Not specified'}
Site Address: ${data.siteAddress || 'Not provided'}

Files Attached: ${data.file ? 'Yes' : 'No'}

Submitted: ${submittedAt}
From: ${data['submitted-from'] || 'Website'}
      `;
    }

    // For now, log the email content (you can later integrate with SendGrid, Mailgun, etc.)
    console.log('EMAIL TO SEND:');
    console.log('Subject:', emailSubject);
    console.log('Content:', emailContent);
    console.log('Recipient: hello@1clickclearance.co.uk');

    // TODO: Integrate with actual email service
    // Example with fetch to external email API:
    /*
    const emailResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: 'hello@1clickclearance.co.uk' }]
        }],
        from: { email: 'forms@1clickclearance.co.uk' },
        subject: emailSubject,
        content: [{ type: 'text/plain', value: emailContent }]
      })
    });
    */

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Form submission processed successfully',
        formName,
        submittedAt
      })
    };

  } catch (error) {
    console.error('Error processing form submission:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
